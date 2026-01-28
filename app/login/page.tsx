"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        const redirect = searchParams.get("redirect") || "/";
        router.push(redirect);
        router.refresh();
      } else {
        setError("Invalid password");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="bg-[#141414] border border-[#262626] rounded-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-white mb-2">
              G0 Experience
            </h1>
            <p className="text-sm text-neutral-400">
              Enter password to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                autoFocus
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#262626] rounded-lg
                         text-white placeholder-neutral-500
                         focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500
                         transition-all"
              />
            </div>

            {error && (
              <p className="text-sm text-red-400 text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full py-3 bg-white text-black font-medium rounded-lg
                       hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed
                       transition-colors"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
          <div className="text-neutral-400">Loading...</div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
