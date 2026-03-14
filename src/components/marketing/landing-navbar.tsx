import Link from "next/link";

const navItems = [
  { href: "#features", label: "Features" },
  { href: "#workflow", label: "How It Works" },
  { href: "#preview", label: "Preview" },
  { href: "#benefits", label: "Benefits" },
];

export function LandingNavbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/50 bg-[#f8fbff]/80 backdrop-blur">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between px-4 py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-sm font-semibold text-white">
            NG
          </span>
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700">
              NextGen TMS
            </div>
            <div className="text-sm text-slate-500">Logistics control tower</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 lg:flex">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="transition hover:text-slate-950">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-950 sm:inline-flex"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="inline-flex rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-700"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
