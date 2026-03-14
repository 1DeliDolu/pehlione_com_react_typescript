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
          setMessage(res.data.message ?? "E-posta adresiniz dogrulandi.");
        }
      } catch (error) {
        if (!cancelled) {
          setState("error");
          setMessage(getApiErrorMessage(error, "Dogrulama basarisiz oldu."));
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
      title="E-posta dogrulama"
      description={
        state === "idle"
          ? "Dogrulama baglantisi bulunamadi. Lutfen e-postanizdaki linki kullanin."
          : state === "loading"
            ? "Token dogrulaniyor..."
            : message
      }
    >
      <section className="route-panel">
        {state === "success" && (
          <>
            <p className="feature-card__kicker">Basarili</p>
            <p>E-posta adresiniz dogrulandi. Artik giris yapabilirsiniz.</p>
            <Link className="button button--primary" to="/login">
              Giris yap
            </Link>
          </>
        )}

        {state === "error" && (
          <>
            <p className="feature-card__kicker">Hata</p>
            <p>{message}</p>
            <p>
              Token suresi dolmus veya gecersiz olabilir. Yeni bir dogrulama
              e-postasi istemek icin giris yapin.
            </p>
          </>
        )}

        {state === "idle" && (
          <>
            <p className="feature-card__kicker">Token bulunamadi</p>
            <p>
              E-posta adresinize gonderilen dogrulama baglantisindan erismeli
              veya kayit olunuz.
            </p>
            <Link className="button button--secondary" to="/register">
              Kayit ol
            </Link>
          </>
        )}
      </section>
    </RouteSection>
  );
}
