# StreetSignal

StreetSignal is a lightweight web app for reporting and tracking local issues in your community — like potholes, broken lights, safety concerns, or sanitation problems.  
It’s built with **Next.js (App Router)** and **Supabase** to provide a fast, anonymous way for residents to submit reports on a shared map.

---

## Features

- 🗺️ **Interactive Map** – View existing reports and pick coordinates when creating a new one.  
- 📝 **Report Form** – Choose a category, enter coordinates, and optionally upload a photo.  
- 🔑 **Reference Codes** – Each submission generates a short reference ID (e.g. `RPT-AB12`) derived from the UUID for easy tracking.  
- 📸 **Photo Uploads** – Optional image upload with basic validation, stored in Supabase Storage.  
- ⚡ **Server Components by Default** – Minimal JavaScript shipped to the client for performance.  
- 🛡️ **Anonymous Reporting** – No authentication or personal data required.  

---

## Tech Stack

- [Next.js 14+](https://nextjs.org/) (App Router, Server Components)
- [Supabase](https://supabase.com/) (Postgres, RPCs, Storage)
- [Leaflet / React-Leaflet](https://react-leaflet.js.org/) for the map
- TypeScript for type safety
- Tailwind CSS for styling

---

## Project Structure

