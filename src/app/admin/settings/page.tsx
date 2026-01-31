import AdminPreviewPhoneFrame from "@/components/admin/AdminPreviewPhoneFrame";
export default function SettingsAdminPage() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
          <p className="mt-1 text-sm text-slate-600">
            Configure system-wide options, security, and integrations.
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="font-semibold text-slate-900">General</h3>
          <p className="mt-2 text-sm text-slate-600">Site name, branding, default algorithm.</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="font-semibold text-slate-900">Security</h3>
          <p className="mt-2 text-sm text-slate-600">Session timeout, 2FA, audit logs.</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="font-semibold text-slate-900">Integrations</h3>
          <p className="mt-2 text-sm text-slate-600">Jisc/OpenAthens, Solana, IPFS/Arweave.</p>
        </div>
      </div>
      <div>
        <AdminPreviewPhoneFrame title="Main app (live)" live />
      </div>
    </div>
  );
}
