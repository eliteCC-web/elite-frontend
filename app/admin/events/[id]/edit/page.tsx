// app/admin/events/[id]/edit/page.tsx
import EditEventClientPage from "@/components/admin/EditEventClientPage";

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EditEventClientPage eventId={id} />;
}