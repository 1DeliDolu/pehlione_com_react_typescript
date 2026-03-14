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
      setStatusMessage(result.message ?? "Reset email triggered.");
      form.reset();
    },
  });

  return (
    <RouteSection
      eyebrow="Recovery"
      title="Dedicated route for the forgot password flow."
      description="Password reset request is now connected to backend endpoint."
    >
      <AuthFormShell
        title="Password recovery"
        description="The system sends a reset email if the address is registered; otherwise it returns the same success response."
        statusMessage={statusMessage}
        errorMessage={
          mutation.error
            ? getApiErrorMessage(mutation.error, "Failed to send reset email.")
            : null
        }
      >
        <form
          className="auth-form"
          onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
        >
          <FormField
            label="Email"
            type="email"
            autoComplete="email"
            {...form.register("email")}
            error={form.formState.errors.email?.message}
          />
          <button
            className="button button--primary"
            type="submit"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Sending" : "Request reset link"}
          </button>
        </form>
      </AuthFormShell>
    </RouteSection>
  );
}
