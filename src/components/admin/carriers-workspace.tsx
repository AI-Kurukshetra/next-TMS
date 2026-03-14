"use client";

import { FormEvent, useEffect, useState } from "react";
import { ResourceSection } from "@/components/ui/resource-section";
import { fetchJson, withAuth } from "@/lib/api/client";
import { canCreateCarrier } from "@/lib/auth/roles";
import { useCurrentAppUser } from "@/lib/auth/use-current-app-user";
import { Carrier } from "@/types/carrier";

export function CarriersWorkspace() {
  const { loading, session, user } = useCurrentAppUser();
  const [carriers, setCarriers] = useState<Carrier[]>([]);
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    if (!session) {
      return;
    }

    const rows = await fetchJson<Carrier[]>(
      "/api/carriers",
      withAuth(session.access_token),
    );
    setCarriers(rows);
  }

  useEffect(() => {
    if (!session || !user) {
      return;
    }

    load().catch((nextError) =>
      setError(nextError instanceof Error ? nextError.message : "Failed to load carriers."),
    );
  }, [session, user]);

  if (loading || !user) {
    return <div className="text-sm text-slate-500">Loading carriers...</div>;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoadingSubmit(true);
    setError(null);

    try {
      await fetchJson(
        "/api/carriers",
        withAuth(session!.access_token, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            companyName,
            contactName,
            phone,
            email,
          }),
        }),
      );

      setCompanyName("");
      setContactName("");
      setPhone("");
      setEmail("");
      await load();
    } catch (nextError) {
      setError(
        nextError instanceof Error ? nextError.message : "Failed to create carrier.",
      );
    } finally {
      setLoadingSubmit(false);
    }
  }

  return (
    <div className="space-y-6">
      {canCreateCarrier(user.role) ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Create Carrier</h2>
            <p className="text-sm text-slate-600">
              Admins can add new transportation partners to the network.
            </p>
          </div>

          <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
            <input
              value={companyName}
              onChange={(event) => setCompanyName(event.target.value)}
              required
              placeholder="Carrier company"
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
            />
            <input
              value={contactName}
              onChange={(event) => setContactName(event.target.value)}
              placeholder="Contact name"
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
            />
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email"
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
            />
            <input
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="Phone"
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
            />
            {error ? (
              <p className="md:col-span-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                {error}
              </p>
            ) : null}
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={loadingSubmit}
                className="inline-flex rounded-xl bg-slate-950 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
              >
                {loadingSubmit ? "Creating..." : "Create Carrier"}
              </button>
            </div>
          </form>
        </section>
      ) : null}

      <ResourceSection
        title="Carrier Master"
        description="Carrier records with regulatory and contact details."
        rows={carriers}
        emptyMessage="No carriers have been created yet."
        columns={[
          {
            header: "Carrier",
            render: (carrier) => (
              <span className="font-medium text-slate-900">
                {carrier.company_name}
              </span>
            ),
          },
          {
            header: "Contact",
            render: (carrier) => carrier.contact_name ?? "-",
          },
          {
            header: "Email",
            render: (carrier) => carrier.email ?? "-",
          },
          {
            header: "Phone",
            render: (carrier) => carrier.phone ?? "-",
          },
        ]}
      />
    </div>
  );
}
