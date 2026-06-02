import { Sidebar } from "../components/common/Sidebar";
import { Navbar } from "../components/common/Navbar";

export default function AppLayout({ children, title, description }) {
  return (
    <div className="flex min-h-screen bg-gray-100">

      <Sidebar />

      <div className="flex flex-col flex-1">

        <Navbar title={title} description={description} />

        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>

      </div>
    </div>
  );
}