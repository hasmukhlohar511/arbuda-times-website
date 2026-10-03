import { requireChatGPTUser } from "@/app/chatgpt-auth";
import AdminDashboard from "@/components/admin-dashboard";
export default async function AdminPage(){const user=await requireChatGPTUser("/admin");return <AdminDashboard user={user.displayName}/>}
