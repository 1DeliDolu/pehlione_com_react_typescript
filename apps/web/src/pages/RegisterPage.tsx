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
      setStatusMessage(result.message ?? "Registration completed.");
      form.reset();
    },
  });

  return (
    <RouteSection
      eyebrow="Auth"
      title="Register page is ready as an independent route."
      description="Account creation form is now directly connected to the register endpoint."
    >
      <AuthFormShell
        title="Account creation"
        description="After registration, the verify-email flow is triggered by the backend."
        statusMessage={statusMessage}
        errorMessage={
          mutation.error
            ? getApiErrorMessage(mutation.error, "Registration failed.")
            : null
        }
      >
        <form
          className="auth-form"
          onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
        >
          <div className="auth-form__grid">
            <FormField
              label="First name"
              autoComplete="given-name"
              {...form.register("firstName")}
              error={form.formState.errors.firstName?.message}
            />
            <FormField
              label="Last name"
              autoComplete="family-name"
              {...form.register("lastName")}
              error={form.formState.errors.lastName?.message}
            />
          </div>
          <FormField
            label="Email"
            type="email"
            autoComplete="email"
            {...form.register("email")}
            error={form.formState.errors.email?.message}
          />
          <FormField
            label="Password"
            type="password"
            autoComplete="new-password"
            {...form.register("password")}
            error={form.formState.errors.password?.message}
          />
          <button
            className="button button--primary"
            type="submit"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Creating account" : "Register"}
          </button>
        </form>
      </AuthFormShell>
    </RouteSection>
  );
}
