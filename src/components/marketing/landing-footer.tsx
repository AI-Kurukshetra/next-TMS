import Link from "next/link";

const footerSections = [
  {
    title: "Product",
    links: [
      { href: "#features", label: "Features" },
      { href: "#preview", label: "Dashboard Preview" },
      { href: "/signup", label: "Get Started" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "#benefits", label: "Why NextGen TMS" },
      { href: "/dashboard", label: "Dashboard" },
      { href: "/login", label: "Login" },
    ],
  },
  {
    title: "Contact",
    links: [
      { href: "mailto:hello@nextgentms.app", label: "hello@nextgentms.app" },
      { href: "tel:+15550190000", label: "+1 (555) 019-0000" },
      { href: "https://github.com/AI-Kurukshetra/next-TMS", label: "GitHub" },
    ],
  },
];

export function LandingFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-[1280px] gap-10 px-4 py-12 lg:grid-cols-[1.2fr_1.8fr] lg:px-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700">
            NextGen Transportation Management System
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-slate-950">
            Logistics orchestration for modern transport teams.
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">
            Manage shipment requests, dispatch execution, driver progress, and
            delivery visibility from a single operations workspace.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-3">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-slate-950">{section.title}</h3>
              <div className="mt-4 flex flex-col gap-3 text-sm text-slate-600">
                {section.links.map((link) =>
                  link.href.startsWith("http") ||
                  link.href.startsWith("mailto:") ||
                  link.href.startsWith("tel:") ? (
                    <a
                      key={link.label}
                      href={link.href}
                      className="transition hover:text-slate-950"
                    >
                      {link.label}
                    </a>
                  ) : link.href.startsWith("#") ? (
                    <a
                      key={link.label}
                      href={link.href}
                      className="transition hover:text-slate-950"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="transition hover:text-slate-950"
                    >
                      {link.label}
                    </Link>
                  ),
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
