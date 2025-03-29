import Topbar from '@/components/admin/topbar/topbar'; 
import Sidebar from '@/components/admin/sidebar/sidebar'; 

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
