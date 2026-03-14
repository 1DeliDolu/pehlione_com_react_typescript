import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterInput } from "@pehlione/shared";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { registerMutation } from "../auth/auth.mutations";
import { AuthFormShell } from "../components/forms/AuthFormShell";
import { FormField } from "../components/forms/FormField";
import { getApiErrorMessage } from "../lib/api-errors";
import { RouteSection } from "../components/routes/RouteSection";

export function RegisterPage() {
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
    },
  });

  const mutation = useMutation({
    mutationFn: registerMutation,
    onSuccess: (result) => {
      setStatusMessage(result.message ?? "Kayit tamamlandi.");
      form.reset();
    },
  });

  return (
    <RouteSection
      eyebrow="Auth"
      title="Register sayfasi bagimsiz route olarak hazir."
      description="Uyelik olusturma formu artik dogrudan register endpoint'ine bagli."
    >
      <AuthFormShell
        title="Account creation"
        description="Kayit sonrasi verify-email akisi backend tarafindan tetiklenir."
        statusMessage={statusMessage}
        errorMessage={
          mutation.error
            ? getApiErrorMessage(mutation.error, "Kayit islemi basarisiz.")
            : null
        }
      >
        <form className="auth-form" onSubmit={form.handleSubmit((values) => mutation.mutate(values))}>
          <div className="auth-form__grid">
            <FormField
              label="Ad"
              autoComplete="given-name"
              {...form.register("firstName")}
              error={form.formState.errors.firstName?.message}
            />
            <FormField
              label="Soyad"
              autoComplete="family-name"
              {...form.register("lastName")}
              error={form.formState.errors.lastName?.message}
            />
          </div>
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
            autoComplete="new-password"
            {...form.register("password")}
            error={form.formState.errors.password?.message}
          />
          <button className="button button--primary" type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Kayit olusturuluyor" : "Register"}
          </button>
        </form>
      </AuthFormShell>
    </RouteSection>
  );
}
