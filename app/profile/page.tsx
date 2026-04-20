import { currentUser, profileSettingsGrid } from "@/lib/mock-data";

export default function ProfilePage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-2 flex flex-col items-center text-center space-y-4">
        <div className="relative inline-block">
          <div className="w-32 h-32 rounded-xl overflow-hidden bg-surface-container-low p-1 ring-4 ring-primary/10">
            <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-full h-full object-cover rounded-lg" />
          </div>
          <button className="absolute -bottom-2 -right-2 bg-secondary text-on-secondary p-2 rounded-lg shadow-lg active:scale-90 transition-transform">
            <span className="material-symbols-outlined text-sm">edit</span>
          </button>
        </div>
        <div>
          <h2 className="font-headline font-extrabold text-3xl tracking-tight text-on-surface mb-2">{currentUser.name}</h2>
          <p className="text-on-surface-variant text-sm leading-relaxed max-w-xs mx-auto font-body">{currentUser.role}</p>
        </div>
        <div className="flex gap-4">
          <div className="px-4 py-2 bg-surface-container-low rounded-lg text-center">
            <span className="block font-bold text-secondary">{currentUser.stats.submitted}</span>
            <span className="text-[10px] uppercase tracking-wider font-semibold opacity-60 font-label">Submitted</span>
          </div>
          <div className="px-4 py-2 bg-surface-container-low rounded-lg text-center">
            <span className="block font-bold text-secondary">{currentUser.stats.benchmarks}</span>
            <span className="text-[10px] uppercase tracking-wider font-semibold opacity-60 font-label">Benchmarks</span>
          </div>
        </div>
      </section>

      {/* Settings Grid */}
      <div className="grid grid-cols-2 gap-4">
        {profileSettingsGrid.map((item) => (
          <button key={item.id} className="bg-surface-container-lowest p-6 rounded-xl text-left hover:bg-surface-container-low group cursor-pointer transition-colors">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-lg bg-secondary/10 text-secondary">
                <span className="material-symbols-outlined">{item.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-headline font-bold text-on-surface text-sm">{item.label}</h3>
                <p className="text-xs text-on-surface-variant mt-0.5">{item.description}</p>
              </div>
              <span className="material-symbols-outlined ml-auto text-outline opacity-40 group-hover:opacity-100 transition-opacity flex-shrink-0">chevron_right</span>
            </div>
          </button>
        ))}
      </div>

      {/* System Preferences */}
      <section>
        <h4 className="font-headline font-extrabold text-xs uppercase tracking-widest text-secondary mb-4">System Preferences</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-on-surface-variant">dark_mode</span>
              <span className="font-medium text-sm">Dark Appearance</span>
            </div>
            <div className="w-10 h-5 bg-outline-variant/30 rounded-full relative cursor-pointer">
              <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" />
            </div>
          </div>
          <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-on-surface-variant">language</span>
              <span className="font-medium text-sm">Language</span>
            </div>
            <span className="text-xs font-bold text-secondary uppercase font-label">English (US)</span>
          </div>
        </div>
      </section>

      {/* Logout */}
      <div className="pb-4">
        <button className="w-full py-4 bg-gradient-to-br from-primary to-primary-container text-on-primary font-headline font-bold rounded-xl shadow-[0_8px_24px_-4px_rgba(62,1,44,0.2)] active:scale-95 transition-all flex items-center justify-center gap-3">
          <span className="material-symbols-outlined">logout</span>
          Logout from System
        </button>
      </div>
    </>
  );
}
