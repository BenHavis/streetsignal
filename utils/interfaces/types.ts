export type ReportType = {
  id: string; // uuid
  title: string;
  description: string | null;
  category: string | null;
  status: string | null;
  priority: string | null;
  latitude: number | null;
  longitude: number | null;
  photo_url: string | null;
  created_at: string; // ISO 8601 timestamp
};
