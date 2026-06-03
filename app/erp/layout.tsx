import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";


export const metadata = {
  manifest: "/manifest.json",
};

export default function ERPLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex bg-[#F5F7FA]">

      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">

        <Topbar />

        <main className="flex-1 overflow-auto p-8">
          {children}
        </main>

      </div>

    </div>
  );
}