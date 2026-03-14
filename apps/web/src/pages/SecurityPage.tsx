import { zodResolver } from "@hookform/resolvers/zod";
import {
  changePasswordSchema,
  type ChangePasswordInput,
} from "@pehlione/shared";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { AuthFormShell } from "../components/forms/AuthFormShell";
import { FormField } from "../components/forms/FormField";
import { getApiErrorMessage } from "../lib/api-errors";
import { RouteSection } from "../components/routes/RouteSection";
import { changePasswordMutation } from "../users/users.api";

export function SecurityPage() {
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const form = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const mutation = useMutation({
    mutationFn: changePasswordMutation,
    onSuccess: (result) => {
      setStatusMessage(result.message ?? "Password changed.");
      form.reset();
    },
  });

  return (
    <RouteSection
      eyebrow="User area"
      title="Security route is dedicated to password and account security."
      description="This page is now connected to the `/users/me/password` endpoint."
      actions={["Change password", "Security notices", "Verification status"]}
    >
      <AuthFormShell
        title="Password update"
        description="The current password is verified, then the new password is hashed on the backend."
        statusMessage={statusMessage}
        errorMessage={
          mutation.error
            ? getApiErrorMessage(mutation.error, "Failed to change password.")
            : null
        }
      >
        <form
          className="auth-form"
          onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
        >
          <FormField
            label="Current password"
            type="password"
            autoComplete="current-password"
            {...form.register("currentPassword")}
            error={form.formState.errors.currentPassword?.message}
          />
          <FormField
            label="New password"
            type="password"
            autoComplete="new-password"
            {...form.register("newPassword")}
            error={form.formState.errors.newPassword?.message}
          />
          <FormField
            label="Confirm new password"
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
            {mutation.isPending ? "Changing" : "Update password"}
          </button>
        </form>
      </AuthFormShell>
    </RouteSection>
  );
}
