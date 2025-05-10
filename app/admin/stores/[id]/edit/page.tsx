// app/admin/stores/[id]/edit/page.tsx
import EditStoreClientPage from '@/components/admin/EditStoreClientPage';

export default async function EditStorePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EditStoreClientPage storeId={id} />;
}
