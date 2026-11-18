import MetasWarRoomPage from "../metas/page";
import { AdminLiveChatInbox } from "@/features/admin/components/AdminLiveChatInbox";

export default function AdminOverviewPage() {
  return (
    <div className="space-y-12">
      <AdminLiveChatInbox />
      <MetasWarRoomPage />
    </div>
  );
}
