import { currentUser } from "@/lib/mock-data";

export default function TopBar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-50/80 backdrop-blur-xl flex justify-between items-center px-6 py-4">
      <div className="flex items-center gap-4">
        <span className="material-symbols-outlined text-blue-600 cursor-pointer">menu</span>
      </div>
      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-fixed">
        <img
          src={currentUser.avatarUrl}
          alt={currentUser.name}
          className="w-full h-full object-cover"
        />
      </div>
    </header>
  );
}
