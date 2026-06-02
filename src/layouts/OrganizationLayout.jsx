import { OrganizationSidebar } from "../components/organization/sidebar/OrganizationSidebar";
import { Navbar } from "../components/common/Navbar";

export default function OrganizationLayout({ children, title, description }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <OrganizationSidebar />

      <div className="flex flex-col flex-1">
        <Navbar title={title} description={description} />

        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
