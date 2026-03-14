import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@pehlione/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { loginMutation } from "../auth/auth.mutations";
import { AuthFormShell } from "../components/forms/AuthFormShell";
import { FormField } from "../components/forms/FormField";
import { getApiErrorMessage } from "../lib/api-errors";
import { queryKeys } from "../lib/queryKeys";
import { RouteSection } from "../components/routes/RouteSection";

export function LoginPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const redirectTarget =
    typeof location.state === "object" &&
    location.state !== null &&
    "from" in location.state &&
    typeof location.state.from === "string"
      ? location.state.from
      : "/dashboard";

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const mutation = useMutation({
    mutationFn: loginMutation,
    onSuccess: async () => {
      setStatusMessage("Login basarili. Session yenileniyor.");
      await queryClient.invalidateQueries({ queryKey: queryKeys.authMe });
      navigate(redirectTarget, { replace: true });
    },
  });

  const onSubmit = form.handleSubmit((values) => mutation.mutate(values));

  return (
    <RouteSection
      eyebrow="Auth"
      title="Login ekrani icin ayrilmis route."
      description={`Form, CSRF ve session tabanli giris akisina baglanacak alan burada konumlanir. Basarili login sonrasi hedef: ${redirectTarget}.`}
    >
      <AuthFormShell
        title="Session login"
        description="Kullanici girisi backend session ve httpOnly cookie ile tamamlanir."
        statusMessage={statusMessage}
        errorMessage={
          mutation.error
            ? getApiErrorMessage(mutation.error, "Login islemi basarisiz.")
            : null
        }
      >
        <form className="auth-form" onSubmit={onSubmit}>
          <FormField
            label="E-posta"
            type="email"
            autoComplete="email"
            {...form.register("email")}
            error={form.formState.errors.email?.message}
          />
          <FormField
            label="Sifre"
            type="password"
            autoComplete="current-password"
            {...form.register("password")}
            error={form.formState.errors.password?.message}
          />
          <button className="button button--primary" type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Giris yapiliyor" : "Login"}
          </button>
        </form>
      </AuthFormShell>
    </RouteSection>
  );
}
