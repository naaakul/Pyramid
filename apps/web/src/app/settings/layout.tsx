import AuthenticatedLayout from "@/components/auth/authenticated-layout";
import SettingsSidebar from "@/components/settings/settings-sidebar";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthenticatedLayout>
      <div className="flex flex-col md:flex-row h-screen overflow-y-auto md:overflow-hidden">
        <SettingsSidebar />

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </AuthenticatedLayout>
  );
}