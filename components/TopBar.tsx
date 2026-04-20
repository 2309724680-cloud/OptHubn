export default function TopBar() {
  return (
    <header className="fixed top-0 w-full z-50 flex items-center justify-between px-6 py-4 bg-[#f8f9fb]/90 backdrop-blur-xl shadow-sm shadow-primary/5">
      <div className="flex items-center gap-3">
        <span className="material-symbols-outlined text-primary">analytics</span>
        <span className="font-headline font-black text-xl tracking-tighter text-primary">NPU HUB</span>
      </div>

      <nav className="hidden md:flex items-center gap-8">
        <a href="/" className="font-headline font-semibold text-secondary hover:opacity-80 transition-opacity">Home</a>
        <a href="/models" className="font-headline font-semibold text-primary-container hover:opacity-80 transition-opacity">Models</a>
        <a href="/submit" className="font-headline font-semibold text-primary-container hover:opacity-80 transition-opacity">Submit</a>
        <span className="material-symbols-outlined text-primary cursor-pointer hover:opacity-80 transition-opacity">account_circle</span>
      </nav>

      <div className="md:hidden">
        <span className="material-symbols-outlined text-primary">menu</span>
      </div>
    </header>
  );
}
