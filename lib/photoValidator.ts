import * as ExifReader from 'exifreader';

export interface PhotoAnalysis {
  fileName: string;
  fileSize: number;
  fileType: string;
  lastModified: Date;
  isJPEG: boolean;
  isPNG: boolean;
  hasGPSData: boolean;
  hasCameraMetadata: boolean;
  suspicionScore: number; // 0-100, higher = more suspicious
  suspicionReasons: string[];
  autoApprove: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  shouldAutoApprove: boolean;
  flaggedForReview: boolean;
  reasons: string[];
  analysis: PhotoAnalysis;
}

/**
 * Analyzes a photo file for spam detection and validation
 */
export async function analyzePhoto(file: File): Promise<PhotoAnalysis> {
  const analysis: PhotoAnalysis = {
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type,
    lastModified: new Date(file.lastModified),
    isJPEG: false,
    isPNG: false,
    hasGPSData: false,
    hasCameraMetadata: false,
    suspicionScore: 0,
    suspicionReasons: [],
    autoApprove: false
  };

  try {
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // Check file type from header
    analysis.isJPEG = uint8Array[0] === 0xFF && uint8Array[1] === 0xD8;
    analysis.isPNG = uint8Array[0] === 0x89 && uint8Array[1] === 0x50 && 
                     uint8Array[2] === 0x4E && uint8Array[3] === 0x47;

    // Basic EXIF check for JPEG files
    if (analysis.isJPEG) {
      analysis.hasCameraMetadata = await hasEXIFData(uint8Array);
      analysis.hasGPSData = await hasGPSInEXIF(uint8Array);
    }

    // Calculate suspicion score
    analysis.suspicionScore = calculateSuspicionScore(analysis);
    analysis.suspicionReasons = getSuspicionReasons(analysis);
    analysis.autoApprove = analysis.suspicionScore < 30; // Threshold for auto-approval

  } catch (error) {
    console.error('Error analyzing photo:', error);
    analysis.suspicionScore = 100; // Max suspicion on error
    analysis.suspicionReasons.push('Error reading file data');
  }

  return analysis;
}

/**
 * Validates a photo for civic reporting
 */
export function validatePhoto(analysis: PhotoAnalysis): ValidationResult {
  const isValid = analysis.fileSize > 0 && 
                  analysis.fileSize < 10 * 1024 * 1024 && // Max 10MB
                  (analysis.isJPEG || analysis.isPNG);

  const shouldAutoApprove = isValid && analysis.autoApprove;
  const flaggedForReview = isValid && !analysis.autoApprove;

  const reasons: string[] = [];
  
  if (!isValid) {
    if (analysis.fileSize === 0) reasons.push('File is empty');
    if (analysis.fileSize > 10 * 1024 * 1024) reasons.push('File too large (max 10MB)');
    if (!analysis.isJPEG && !analysis.isPNG) reasons.push('Only JPEG and PNG files allowed');
  }

  if (flaggedForReview) {
    reasons.push(...analysis.suspicionReasons);
  }

  return {
    isValid,
    shouldAutoApprove,
    flaggedForReview,
    reasons,
    analysis
  };
}

/**
 * Simple function to log photo analysis results
 */
export function logPhotoAnalysis(analysis: PhotoAnalysis): void {
  console.log('=== PHOTO ANALYSIS ===');
  console.log('File:', analysis.fileName);
  console.log('Size:', (analysis.fileSize / 1024).toFixed(1) + 'KB');
  console.log('Type:', analysis.fileType);
  console.log('Is JPEG:', analysis.isJPEG);
  console.log('Is PNG:', analysis.isPNG);
  console.log('Has GPS:', analysis.hasGPSData);
  console.log('Has Camera Metadata:', analysis.hasCameraMetadata);
  console.log('Suspicion Score:', analysis.suspicionScore + '/100');
  console.log('Auto Approve:', analysis.autoApprove);
  if (analysis.suspicionReasons.length > 0) {
    console.log('Flags:', analysis.suspicionReasons.join(', '));
  }
  console.log('===================');
}

// Helper functions using ExifReader
async function hasEXIFData(uint8Array: Uint8Array): Promise<boolean> {
  try {
    const tags = ExifReader.load(uint8Array.buffer);
    
    // Check for common camera metadata with proper null checking
    return !!(tags.Make?.description || tags.Model?.description || 
              tags.DateTime?.description || tags.Software?.description);
  } catch (error) {
    console.log('Error reading EXIF data:', error);
    return false;
  }
}

async function hasGPSInEXIF(uint8Array: Uint8Array): Promise<boolean> {
  try {
    const tags = ExifReader.load(uint8Array.buffer);
    
    // Check for GPS coordinates with proper null checking
    const hasGPS = !!(tags.GPSLatitude?.description && tags.GPSLongitude?.description);
    
    if (hasGPS) {
      console.log('GPS found:', {
        latitude: tags.GPSLatitude?.description,
        longitude: tags.GPSLongitude?.description
      });
    }
    
    return hasGPS;
  } catch (error) {
    console.log('Error reading GPS data:', error);
    return false;
  }
}

function calculateSuspicionScore(analysis: PhotoAnalysis): number {
  let score = 0;

  // File type factors
  if (analysis.isPNG) score += 20; // PNGs more likely to be screenshots
  if (!analysis.isJPEG) score += 10;

  // Metadata factors
  if (!analysis.hasCameraMetadata) score += 25;
  if (!analysis.hasGPSData) score += 15;

  // Filename factors
  const suspiciousNames = ['screenshot', 'screen shot', 'image', 'picture', 'download'];
  const fileName = analysis.fileName.toLowerCase();
  if (suspiciousNames.some(name => fileName.includes(name))) {
    score += 30;
  }

  // Generic dimensions (common screenshot sizes)
  const genericNames = ['400x800', '1080x', '1920x', '375x'];
  if (genericNames.some(dim => fileName.includes(dim))) {
    score += 25;
  }

  // File size factors
  if (analysis.fileSize < 50 * 1024) score += 10; // Very small files
  if (analysis.fileSize > 5 * 1024 * 1024) score += 5; // Very large files

  return Math.min(score, 100); // Cap at 100
}

function getSuspicionReasons(analysis: PhotoAnalysis): string[] {
  const reasons: string[] = [];

  if (analysis.isPNG) reasons.push('PNG format (could be screenshot)');
  if (!analysis.hasCameraMetadata) reasons.push('Missing camera metadata');
  if (!analysis.hasGPSData) reasons.push('No GPS coordinates');
  
  const fileName = analysis.fileName.toLowerCase();
  if (fileName.includes('screenshot') || fileName.includes('screen shot')) {
    reasons.push('Filename suggests screenshot');
  }
  
  if (['400x800', '1080x', '1920x'].some(dim => fileName.includes(dim))) {
    reasons.push('Generic screen dimensions in filename');
  }

  if (analysis.fileSize < 50 * 1024) {
    reasons.push('Very small file size');
  }

  return reasons;
}