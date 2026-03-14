import { zodResolver } from "@hookform/resolvers/zod";
import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from "@pehlione/shared";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { forgotPasswordMutation } from "../auth/auth.mutations";
import { AuthFormShell } from "../components/forms/AuthFormShell";
import { FormField } from "../components/forms/FormField";
import { getApiErrorMessage } from "../lib/api-errors";
import { RouteSection } from "../components/routes/RouteSection";

export function ForgotPasswordPage() {
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const mutation = useMutation({
    mutationFn: forgotPasswordMutation,
    onSuccess: (result) => {
      setStatusMessage(result.message ?? "Reset maili tetiklendi.");
      form.reset();
    },
  });

  return (
    <RouteSection
      eyebrow="Recovery"
      title="Forgot password akisi icin ozel route."
      description="Password reset istegi artik backend endpoint'ine bagli."
    >
      <AuthFormShell
        title="Password recovery"
        description="Sistem, e-posta kayitliysa reset mailini gonderir; degilse de ayni basari cevabini verir."
        statusMessage={statusMessage}
        errorMessage={
          mutation.error
            ? getApiErrorMessage(mutation.error, "Reset maili gonderilemedi.")
            : null
        }
      >
        <form className="auth-form" onSubmit={form.handleSubmit((values) => mutation.mutate(values))}>
          <FormField
            label="E-posta"
            type="email"
            autoComplete="email"
            {...form.register("email")}
            error={form.formState.errors.email?.message}
          />
          <button className="button button--primary" type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Gonderiliyor" : "Reset linki iste"}
          </button>
        </form>
      </AuthFormShell>
    </RouteSection>
  );
}
