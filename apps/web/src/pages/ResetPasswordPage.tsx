import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema, type ResetPasswordInput } from "@pehlione/shared";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router";

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
      setStatusMessage(result.message ?? "Password updated.");
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
      title="Reset password token verification page."
      description="Single-use token and new password form are now connected to the reset endpoint."
    >
      <AuthFormShell
        title="Password reset"
        description="If the token comes via query string, it is auto-filled in the form."
        statusMessage={statusMessage}
        errorMessage={
          mutation.error
            ? getApiErrorMessage(mutation.error, "Password reset failed.")
            : null
        }
      >
        <form
          className="auth-form"
          onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
        >
          <FormField
            label="Token"
            {...form.register("token")}
            error={form.formState.errors.token?.message}
          />
          <FormField
            label="New password"
            type="password"
            autoComplete="new-password"
            {...form.register("password")}
            error={form.formState.errors.password?.message}
          />
          <FormField
            label="Confirm password"
            type="password"
            autoComplete="new-password"
            {...form.register("confirmPassword")}
            error={form.formState.errors.confirmPassword?.message}
          />
          <button
            className="button button--primary"
            type="submit"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Updating" : "Reset password"}
          </button>
        </form>
      </AuthFormShell>
    </RouteSection>
  );
}
