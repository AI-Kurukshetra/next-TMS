import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Boxes,
  Gauge,
  LineChart,
  MapPinned,
  PackageCheck,
  Route,
  ShieldCheck,
  Truck,
  Users,
  Waves,
} from "lucide-react";
import { FeatureCard } from "@/components/marketing/feature-card";
import { LandingFooter } from "@/components/marketing/landing-footer";
import { LandingNavbar } from "@/components/marketing/landing-navbar";

const features = [
  {
    icon: Boxes,
    title: "Shipment Management",
    description:
      "Create requests, dispatch bookings, and monitor every shipment from intake to proof of delivery.",
  },
  {
    icon: MapPinned,
    title: "Real-time Tracking",
    description:
      "Keep operations, drivers, and customers aligned with live milestone visibility and shipment status changes.",
  },
  {
    icon: Truck,
    title: "Carrier Management",
    description:
      "Maintain carrier partners, assign loads faster, and keep transport capacity organized.",
  },
  {
    icon: Users,
    title: "Driver & Vehicle Management",
    description:
      "Link drivers, vehicles, and shipments so dispatch knows exactly who is moving what.",
  },
  {
    icon: Route,
    title: "Route Optimization",
    description:
      "Build cleaner delivery execution with route planning, assignment readiness, and location context.",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description:
      "Track shipment volume, active loads, delivery outcomes, and operational bottlenecks in one place.",
  },
];

const workflow = [
  {
    step: "01",
    title: "Customer Request",
    description: "Customers raise shipment requests with pickup and delivery details.",
  },
  {
    step: "02",
    title: "Shipment Intake",
    description: "Dispatch validates the booking and adds it into the active transport pipeline.",
  },
  {
    step: "03",
    title: "Carrier Assignment",
    description: "A matching carrier, driver, and vehicle are assigned to execute the move.",
  },
  {
    step: "04",
    title: "Delivery Execution",
    description: "Drivers update milestones while customers and dispatch follow delivery progress.",
  },
];

const metrics = [
  { label: "Total Shipments", value: "2,480" },
  { label: "Active Drivers", value: "184" },
  { label: "In Transit Deliveries", value: "326" },
  { label: "On-time Delivery Rate", value: "96.4%" },
];

const benefits = [
  "Reduce logistics cost with tighter dispatch coordination.",
  "Get real-time shipment visibility across customers, drivers, and dispatch.",
  "Improve route planning and assignment readiness before a load moves.",
  "Measure carrier and delivery performance with actionable operational analytics.",
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.18),_transparent_28%),linear-gradient(180deg,#f8fbff_0%,#eef4fb_52%,#f7fafc_100%)] text-slate-950">
      <LandingNavbar />

      <main>
        <section className="relative overflow-hidden">
          <div className="mx-auto grid max-w-[1280px] gap-16 px-4 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-28">
            <div className="relative z-10">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-700">
                NextGen Transportation Management System
              </p>
              <h1 className="mt-6 max-w-3xl text-5xl font-semibold leading-[1.02] tracking-tight text-slate-950 sm:text-6xl">
                Dispatch smarter, track faster, and move logistics with total control.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                A modern logistics command center for shipment requests, carrier
                assignment, driver execution, and customer delivery visibility.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3.5 text-sm font-medium text-white transition hover:bg-sky-700"
                >
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3.5 text-sm font-medium text-slate-700 transition hover:border-slate-950 hover:text-slate-950"
                >
                  View Dashboard
                </Link>
              </div>

              <div className="mt-12 grid gap-4 sm:grid-cols-3">
                {[
                  { label: "Shipment Visibility", value: "Live" },
                  { label: "Assignment Workflow", value: "Unified" },
                  { label: "Customer Tracking", value: "Built-in" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-white/70 bg-white/75 p-4 shadow-sm backdrop-blur"
                  >
                    <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                      {item.label}
                    </div>
                    <div className="mt-2 text-2xl font-semibold text-slate-950">
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 -translate-y-8 rounded-[40px] bg-[radial-gradient(circle_at_25%_25%,rgba(59,130,246,0.25),transparent_28%),radial-gradient(circle_at_78%_20%,rgba(14,165,233,0.2),transparent_24%),radial-gradient(circle_at_50%_80%,rgba(15,23,42,0.12),transparent_34%)]" />
              <div className="relative overflow-hidden rounded-[32px] border border-white/70 bg-slate-950 p-6 text-white shadow-2xl shadow-slate-300/70">
                <div className="flex items-center justify-between border-b border-white/10 pb-5">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-sky-300">
                      Control Tower
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold">
                      Logistics command view
                    </h2>
                  </div>
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                    <Waves className="h-6 w-6 text-sky-300" />
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    {[
                      { label: "Booked Today", value: "128" },
                      { label: "Dispatch Ready", value: "42" },
                      { label: "In Transit", value: "326" },
                      { label: "Exceptions", value: "07" },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="rounded-2xl border border-white/10 bg-white/5 p-4"
                      >
                        <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
                          {item.label}
                        </div>
                        <div className="mt-3 text-3xl font-semibold">{item.value}</div>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-300">Route activity</p>
                        <h3 className="mt-1 text-lg font-semibold">Ahmedabad to Mumbai</h3>
                      </div>
                      <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-300">
                        In Transit
                      </span>
                    </div>
                    <div className="mt-6 flex items-center gap-3">
                      <div className="h-3 w-3 rounded-full bg-sky-400" />
                      <div className="h-px flex-1 border-t border-dashed border-sky-300/40" />
                      <div className="h-3 w-3 rounded-full bg-sky-400" />
                      <div className="h-px flex-1 border-t border-dashed border-slate-500/60" />
                      <div className="h-3 w-3 rounded-full bg-slate-600" />
                    </div>
                    <div className="mt-3 grid grid-cols-3 text-xs uppercase tracking-[0.18em] text-slate-400">
                      <span>Pickup</span>
                      <span className="text-center">Hub</span>
                      <span className="text-right">Delivery</span>
                    </div>
                  </div>
                </div>

                <div className="pointer-events-none absolute -right-16 top-20 h-48 w-48 rounded-full bg-sky-400/20 blur-3xl" />
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-[1280px] px-4 py-20 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.26em] text-sky-700">
              Platform Features
            </p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">
              Built for shipment flow, dispatch execution, and delivery visibility.
            </h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {features.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </section>

        <section id="workflow" className="border-y border-slate-200 bg-white/70">
          <div className="mx-auto max-w-[1280px] px-4 py-20 lg:px-8">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.26em] text-sky-700">
                How It Works
              </p>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">
                Customer to delivery, mapped as one operational timeline.
              </h2>
            </div>

            <div className="mt-12 grid gap-6 lg:grid-cols-4">
              {workflow.map((item, index) => (
                <div
                  key={item.step}
                  className="relative rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  {index < workflow.length - 1 ? (
                    <div className="absolute right-[-24px] top-10 hidden h-px w-12 border-t border-dashed border-sky-300 lg:block" />
                  ) : null}
                  <div className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-700">
                    {item.step}
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-slate-950">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="preview" className="mx-auto max-w-[1280px] px-4 py-20 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.26em] text-sky-700">
                Dashboard Preview
              </p>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">
                A clean operations cockpit for hackathon demos and real workflow storytelling.
              </h2>
              <p className="mt-5 text-base leading-8 text-slate-600">
                Highlight customer intake, dispatch readiness, driver execution, and
                analytics in one controlled view that is easy to demo and easy to scan.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  {
                    icon: Gauge,
                    title: "Fast dispatch scanning",
                    description: "See load readiness, assignment state, and milestones at a glance.",
                  },
                  {
                    icon: LineChart,
                    title: "Executive metrics",
                    description: "Show shipment throughput, on-time rates, and delivery health live.",
                  },
                  {
                    icon: ShieldCheck,
                    title: "Role-based access",
                    description: "Customers, dispatchers, drivers, and admins each get focused workflows.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                  >
                    <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-950">{item.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-slate-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/80">
              <div className="rounded-[26px] bg-slate-950 p-5 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-sky-300">
                      Operations Overview
                    </p>
                    <h3 className="mt-2 text-2xl font-semibold">Dashboard snapshot</h3>
                  </div>
                  <PackageCheck className="h-7 w-7 text-sky-300" />
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {metrics.map((metric) => (
                    <div
                      key={metric.label}
                      className="rounded-2xl border border-white/10 bg-white/5 p-4"
                    >
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                        {metric.label}
                      </p>
                      <p className="mt-3 text-3xl font-semibold">{metric.value}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-5">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3 text-xs uppercase tracking-[0.18em] text-slate-400">
                    <span>Shipment</span>
                    <span>Status</span>
                  </div>
                  <div className="space-y-3 pt-4">
                    {[
                      ["SHP-20481", "Ahmedabad → Mumbai", "In Transit"],
                      ["SHP-20482", "Delhi → Jaipur", "Dispatch Ready"],
                      ["SHP-20483", "Pune → Nashik", "Delivered"],
                    ].map(([id, route, status]) => (
                      <div
                        key={id}
                        className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3"
                      >
                        <div>
                          <p className="text-sm font-medium text-white">{id}</p>
                          <p className="text-sm text-slate-400">{route}</p>
                        </div>
                        <span className="rounded-full bg-sky-400/15 px-3 py-1 text-xs font-medium text-sky-300">
                          {status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="benefits" className="mx-auto max-w-[1280px] px-4 py-20 lg:px-8">
          <div className="rounded-[36px] border border-slate-200 bg-white px-6 py-10 shadow-sm lg:px-10 lg:py-12">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.26em] text-sky-700">
                  Business Benefits
                </p>
                <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">
                  A logistics system that helps teams move with less friction.
                </h2>
              </div>
              <div className="grid gap-4">
                {benefits.map((benefit) => (
                  <div
                    key={benefit}
                    className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-full bg-sky-100 text-sky-700">
                      <ArrowRight className="h-4 w-4" />
                    </div>
                    <p className="text-sm leading-7 text-slate-700">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1280px] px-4 pb-20 lg:px-8">
          <div className="relative overflow-hidden rounded-[36px] bg-slate-950 px-6 py-12 text-white shadow-2xl shadow-slate-300/70 lg:px-12">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(14,165,233,0.28),_transparent_28%),radial-gradient(circle_at_bottom_left,_rgba(56,189,248,0.18),_transparent_26%)]" />
            <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-300">
                  Ready to Launch
                </p>
                <h2 className="mt-4 text-4xl font-semibold tracking-tight">
                  Start managing shipments, dispatch, and delivery from one platform.
                </h2>
                <p className="mt-4 text-base leading-8 text-slate-300">
                  Create accounts for customers, dispatchers, drivers, and admins and
                  demo the full transport workflow end to end.
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3.5 text-sm font-medium text-slate-950 transition hover:bg-sky-100"
                >
                  Get Started
                </Link>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3.5 text-sm font-medium text-white transition hover:bg-white/10"
                >
                  View Dashboard
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
