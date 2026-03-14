import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@pehlione/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";

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
      setStatusMessage("Login successful. Refreshing session.");
      await queryClient.invalidateQueries({ queryKey: queryKeys.authMe });
      navigate(redirectTarget, { replace: true });
    },
  });

  const onSubmit = form.handleSubmit((values) => mutation.mutate(values));

  return (
    <RouteSection
      eyebrow="Auth"
      title="Dedicated route for the login screen."
      description={`The form and CSRF/session-based login flow is located here. Redirect target after successful login: ${redirectTarget}.`}
    >
      <AuthFormShell
        title="Session login"
        description="User login is completed with backend session and httpOnly cookie."
        statusMessage={statusMessage}
        errorMessage={
          mutation.error
            ? getApiErrorMessage(mutation.error, "Login failed.")
            : null
        }
      >
        <form className="auth-form" onSubmit={onSubmit}>
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
            autoComplete="current-password"
            {...form.register("password")}
            error={form.formState.errors.password?.message}
          />
          <button
            className="button button--primary"
            type="submit"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Signing in" : "Login"}
          </button>
        </form>
      </AuthFormShell>
    </RouteSection>
  );
}
