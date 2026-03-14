import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { apiClient } from "../lib/api";
import type { ApiResponse } from "@pehlione/shared";
import { getApiErrorMessage } from "../lib/api-errors";
import { RouteSection } from "../components/routes/RouteSection";

type VerifyState = "idle" | "loading" | "success" | "error";

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [state, setState] = useState<VerifyState>(token ? "loading" : "idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    async function verify() {
      try {
        const res = await apiClient.get<ApiResponse>("/auth/verify-email", {
          params: { token },
        });
        if (!cancelled) {
          setState("success");
          setMessage(
            res.data.message ?? "Your email address has been verified.",
          );
        }
      } catch (error) {
        if (!cancelled) {
          setState("error");
          setMessage(getApiErrorMessage(error, "Verification failed."));
        }
      }
    }

    verify();
    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <RouteSection
      eyebrow="Verification"
      title="Email verification"
      description={
        state === "idle"
          ? "No verification link found. Please use the link from your email."
          : state === "loading"
            ? "Verifying token..."
            : message
      }
    >
      <section className="route-panel">
        {state === "success" && (
          <>
            <p className="feature-card__kicker">Success</p>
            <p>Your email address has been verified. You can now sign in.</p>
            <Link className="button button--primary" to="/login">
              Sign in
            </Link>
          </>
        )}

        {state === "error" && (
          <>
            <p className="feature-card__kicker">Error</p>
            <p>{message}</p>
            <p>
              The token may have expired or is invalid. Sign in to request a new
              verification email.
            </p>
          </>
        )}

        {state === "idle" && (
          <>
            <p className="feature-card__kicker">Token not found</p>
            <p>
              Please access through the verification link sent to your email
              address or register.
            </p>
            <Link className="button button--secondary" to="/register">
              Register
            </Link>
          </>
        )}
      </section>
    </RouteSection>
  );
}
