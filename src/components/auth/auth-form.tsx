"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { USER_ROLE_OPTIONS, getDefaultRouteForRole } from "@/lib/auth/roles";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { UserRole } from "@/types/user";

type AuthFormProps = {
  mode: "login" | "signup";
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<UserRole>("customer");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function syncRoleProfile(accessToken: string, nextRole: UserRole) {
    const response = await fetch("/api/me", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        fullName,
        role: nextRole,
      }),
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as
        | { error?: string }
        | null;
      throw new Error(payload?.error ?? "Failed to save user role.");
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const supabase = createBrowserSupabaseClient();

    try {
      if (mode === "signup") {
        if (password.length < 6) {
          throw new Error("Password must be at least 6 characters.");
        }

        if (password !== confirmPassword) {
          throw new Error("Passwords do not match.");
        }

        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName.trim() || email.split("@")[0],
              role,
            },
          },
        });

        if (signUpError) {
          throw signUpError;
        }

        if (!data.session) {
          setMessage(
            "Account created. If email confirmation is enabled in Supabase, confirm your email before logging in.",
          );
          return;
        }

        await syncRoleProfile(data.session.access_token, role);
        setMessage("Account created. Redirecting to your workspace...");
        router.replace(getDefaultRouteForRole(role));
        router.refresh();
        return;
      }

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        throw signInError;
      }

      if (data.session) {
        const metadataRole = data.session.user.user_metadata?.role;
        const nextRole =
          typeof metadataRole === "string" &&
          USER_ROLE_OPTIONS.some((option) => option.value === metadataRole)
            ? (metadataRole as UserRole)
            : "customer";

        await syncRoleProfile(data.session.access_token, nextRole);
      }

      const next = searchParams.get("next") || "/dashboard";
      router.replace(next);
      router.refresh();
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : `Failed to ${mode}.`,
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-slate-950">
          {mode === "login" ? "Login" : "Create account"}
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          {mode === "login"
            ? "Access dispatch, shipments, and tracking operations."
            : "Create a TMS account and assign the correct operational role."}
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {mode === "signup" ? (
          <div>
            <label
              htmlFor="fullName"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Full Name
            </label>
            <input
              id="fullName"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
              placeholder="Priya Shah"
            />
          </div>
        ) : null}

        {mode === "signup" ? (
          <div>
            <label
              htmlFor="role"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Role
            </label>
            <select
              id="role"
              value={role}
              onChange={(event) => setRole(event.target.value as UserRole)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
            >
              {USER_ROLE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-slate-500">
              {
                USER_ROLE_OPTIONS.find((option) => option.value === role)
                  ?.description
              }
            </p>
          </div>
        ) : null}

        <div>
          <label
            htmlFor="email"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
            placeholder="dispatcher@example.com"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
            placeholder="Minimum 6 characters"
          />
        </div>

        {mode === "signup" ? (
          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
              placeholder="Re-enter password"
            />
          </div>
        ) : null}

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
          className="inline-flex w-full items-center justify-center rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50"
        >
          {loading
            ? mode === "login"
              ? "Signing in..."
              : "Creating account..."
            : mode === "login"
              ? "Login"
              : "Sign up"}
        </button>
      </form>

      <p className="mt-6 text-sm text-slate-600">
        {mode === "login" ? "Need an account?" : "Already have an account?"}{" "}
        <Link
          href={mode === "login" ? "/signup" : "/login"}
          className="font-medium text-slate-950 underline"
        >
          {mode === "login" ? "Sign up" : "Login"}
        </Link>
      </p>
    </section>
  );
}
