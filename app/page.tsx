import { currentUser, recentProjects } from "@/lib/mock-data";

export default function HomePage() {
  return (
    <>
      {/* Welcome Hero */}
      <section className="pt-4">
        <div className="inline-block px-3 py-1 bg-primary/10 rounded-full mb-4">
          <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-primary font-label">
            Overview
          </span>
        </div>
        <h2 className="font-headline text-[3.5rem] font-extrabold leading-tight tracking-tight text-on-surface mb-2">
          Hello,{" "}
          <span className="text-primary">{currentUser.name}</span>
        </h2>
        <p className="font-body text-on-surface-variant text-sm max-w-[280px] leading-relaxed">
          Your architectural landscape is performing at 94% efficiency today.
        </p>
      </section>

      {/* Bento Quick Actions */}
      <section className="grid grid-cols-2 gap-4">
        {/* Current Task - full width */}
        <div className="col-span-2 bg-surface-container-lowest p-6 rounded-xl shadow-[0_8px_24px_-4px_rgba(25,28,30,0.06)] flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-on-surface-variant font-label mb-1">
              Current Task
            </span>
            <span className="font-headline font-bold text-lg text-on-surface">Design Review</span>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-container rounded-xl flex items-center justify-center text-on-primary shadow-lg">
            <span className="material-symbols-outlined">rocket_launch</span>
          </div>
        </div>

        {/* New Draft */}
        <div className="bg-surface-container-low p-5 rounded-xl flex flex-col justify-between h-36 active:scale-95 transition-transform duration-200 cursor-pointer">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-primary shadow-sm">
            <span className="material-symbols-outlined">draw</span>
          </div>
          <span className="font-headline font-bold text-sm">New Draft</span>
        </div>

        {/* Sync Assets */}
        <div className="bg-surface-container-low p-5 rounded-xl flex flex-col justify-between h-36 active:scale-95 transition-transform duration-200 cursor-pointer">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-primary shadow-sm">
            <span className="material-symbols-outlined">cloud_done</span>
          </div>
          <span className="font-headline font-bold text-sm">Sync Assets</span>
        </div>
      </section>

      {/* Recent Projects */}
      <section>
        <div className="flex justify-between items-end mb-6">
          <h3 className="font-headline text-xl font-bold tracking-tight">Recent Projects</h3>
          <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-primary cursor-pointer font-label">
            View All
          </span>
        </div>
        <div className="space-y-4">
          {recentProjects.map((project) => (
            <div
              key={project.id}
              className="group relative overflow-hidden rounded-xl bg-surface-container-lowest p-4 flex gap-4 items-center shadow-[0_8px_24px_-4px_rgba(25,28,30,0.04)] cursor-pointer hover:bg-slate-50 transition-colors"
            >
              <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="font-headline font-bold text-on-surface text-base">{project.title}</p>
                <p className="font-body text-on-surface-variant text-xs mt-1">{project.time}</p>
              </div>
              <span className="material-symbols-outlined text-outline-variant group-hover:text-primary transition-colors">
                chevron_right
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* FAB */}
      <div className="fixed bottom-24 right-6 z-40">
        <button className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-container text-on-primary flex items-center justify-center shadow-[0_8px_24px_-4px_rgba(0,74,198,0.3)] active:scale-90 transition-transform duration-200">
          <span
            className="material-symbols-outlined text-3xl"
            style={{ fontVariationSettings: "'FILL' 0" }}
          >
            add
          </span>
        </button>
      </div>
    </>
  );
}
