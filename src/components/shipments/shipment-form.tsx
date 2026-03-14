"use client";

import { FormEvent, useMemo, useState } from "react";
import { canCreateShipment } from "@/lib/auth/roles";
import { fetchJson, withAuth } from "@/lib/api/client";
import { AppUser } from "@/types/user";
import { Shipment } from "@/types/shipment";

type ShipmentFormProps = {
  accessToken: string;
  customers: Array<{ id: string; name: string }>;
  onCreated?: (shipment: Shipment) => void;
  user: AppUser;
};

export function ShipmentForm({
  accessToken,
  customers,
  onCreated,
  user,
}: ShipmentFormProps) {
  const defaultCustomerId = useMemo(() => {
    if (user.role === "customer") {
      return user.customer_id ?? "";
    }

    return customers[0]?.id ?? "";
  }, [customers, user.customer_id, user.role]);
  const [customerId, setCustomerId] = useState(defaultCustomerId);
  const [originLocation, setOriginLocation] = useState("");
  const [destinationLocation, setDestinationLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  if (!canCreateShipment(user.role)) {
    return (
      <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Shipment Intake</h2>
        <p className="mt-2 text-sm text-slate-600">
          Your role can view shipment activity, but only customers, dispatchers,
          and admins can create new requests.
        </p>
      </section>
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const shipment = await fetchJson<Shipment>(
        "/api/shipments",
        withAuth(accessToken, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customerId: user.role === "customer" ? user.customer_id : customerId,
            originLocation,
            destinationLocation,
          }),
        }),
      );

      setOriginLocation("");
      setDestinationLocation("");
      setMessage(
        user.role === "customer"
          ? "Shipment request submitted."
          : "Shipment created.",
      );
      onCreated?.(shipment);
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Failed to create shipment.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">
          {user.role === "customer" ? "Create Shipment Request" : "Create Shipment"}
        </h2>
        <p className="text-sm text-slate-600">
          {user.role === "customer"
            ? "Submit a new shipment request and track it through dispatch and delivery."
            : "Capture customer, origin, and destination details for a new booking."}
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {user.role !== "customer" ? (
          <div>
            <label htmlFor="customerId" className="mb-1 block text-sm font-medium">
              Customer
            </label>
            <select
              id="customerId"
              value={customerId}
              onChange={(event) => setCustomerId(event.target.value)}
              required
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
            >
              <option value="">Select customer</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-600">
            Requesting as your customer account
          </div>
        )}

        <div>
          <label
            htmlFor="originLocation"
            className="mb-1 block text-sm font-medium"
          >
            Origin Location
          </label>
          <input
            id="originLocation"
            value={originLocation}
            onChange={(event) => setOriginLocation(event.target.value)}
            required
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none ring-0 placeholder:text-slate-400 focus:border-slate-500"
            placeholder="Ahmedabad Warehouse"
          />
        </div>

        <div>
          <label
            htmlFor="destinationLocation"
            className="mb-1 block text-sm font-medium"
          >
            Destination Location
          </label>
          <input
            id="destinationLocation"
            value={destinationLocation}
            onChange={(event) => setDestinationLocation(event.target.value)}
            required
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none ring-0 placeholder:text-slate-400 focus:border-slate-500"
            placeholder="Mumbai Distribution Center"
          />
        </div>

        {error ? (
          <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {error}
          </p>
        ) : null}

        {message ? (
          <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            {message}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex rounded-xl bg-slate-950 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {loading
            ? user.role === "customer"
              ? "Submitting..."
              : "Creating..."
            : user.role === "customer"
              ? "Submit Request"
              : "Create Shipment"}
        </button>
      </form>
    </section>
  );
}
