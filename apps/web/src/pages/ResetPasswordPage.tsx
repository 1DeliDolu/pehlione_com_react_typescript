import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema, type ResetPasswordInput } from "@pehlione/shared";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";

import { resetPasswordMutation } from "../auth/auth.mutations";
import { AuthFormShell } from "../components/forms/AuthFormShell";
import { FormField } from "../components/forms/FormField";
import { getApiErrorMessage } from "../lib/api-errors";
import { RouteSection } from "../components/routes/RouteSection";

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const token = searchParams.get("token") ?? "";
  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token,
      password: "",
      confirmPassword: "",
    },
  });

  const mutation = useMutation({
    mutationFn: resetPasswordMutation,
    onSuccess: (result) => {
      setStatusMessage(result.message ?? "Sifre guncellendi.");
      form.reset({
        token,
        password: "",
        confirmPassword: "",
      });
    },
  });

  return (
    <RouteSection
      eyebrow="Recovery"
      title="Reset password token dogrulama sayfasi."
      description="Tek kullanimlik token ve yeni parola formu artik reset endpoint'ine bagli."
    >
      <AuthFormShell
        title="Password reset"
        description="Token query string uzerinden gelirse forma otomatik yazilir."
        statusMessage={statusMessage}
        errorMessage={
          mutation.error
            ? getApiErrorMessage(mutation.error, "Sifre sifirlama basarisiz.")
            : null
        }
      >
        <form className="auth-form" onSubmit={form.handleSubmit((values) => mutation.mutate(values))}>
          <FormField
            label="Token"
            {...form.register("token")}
            error={form.formState.errors.token?.message}
          />
          <FormField
            label="Yeni sifre"
            type="password"
            autoComplete="new-password"
            {...form.register("password")}
            error={form.formState.errors.password?.message}
          />
          <FormField
            label="Sifre tekrar"
            type="password"
            autoComplete="new-password"
            {...form.register("confirmPassword")}
            error={form.formState.errors.confirmPassword?.message}
          />
          <button className="button button--primary" type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Guncelleniyor" : "Sifreyi yenile"}
          </button>
        </form>
      </AuthFormShell>
    </RouteSection>
  );
}
