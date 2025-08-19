// app/report/page.tsx  (Server Component)
import ReportForm from "./ReportForm";

export default function ReportPage() {
  // No browser-only APIs, no "use client"
  return <ReportForm />;
}
