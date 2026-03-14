import { zodResolver } from "@hookform/resolvers/zod";
import { updateProfileSchema, type UpdateProfileInput } from "@pehlione/shared";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { KeyValueList } from "../components/data/KeyValueList";
import { AuthFormShell } from "../components/forms/AuthFormShell";
import { FormField } from "../components/forms/FormField";
import { getApiErrorMessage } from "../lib/api-errors";
import { queryKeys } from "../lib/queryKeys";
import { RouteSection } from "../components/routes/RouteSection";
import {
  fetchUserProfile,
  updateUserProfileMutation,
} from "../users/users.api";

export function ProfilePage() {
  const queryClient = useQueryClient();
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const profileQuery = useQuery({
    queryKey: queryKeys.userProfile,
    queryFn: fetchUserProfile,
  });
  const profile = profileQuery.data;
  const form = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
    },
  });

  useEffect(() => {
    if (!profile) {
      return;
    }

    form.reset({
      firstName: profile.firstName,
      lastName: profile.lastName,
    });
  }, [form, profile]);

  const mutation = useMutation({
    mutationFn: updateUserProfileMutation,
    onSuccess: async (result) => {
      setStatusMessage("Profile updated.");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.userProfile }),
        queryClient.invalidateQueries({ queryKey: queryKeys.authMe }),
      ]);
      form.reset({
        firstName: result.data?.firstName ?? "",
        lastName: result.data?.lastName ?? "",
      });
    },
  });

  return (
    <RouteSection
      eyebrow="User area"
      title="Profile route isolates user information."
      description="This page now fetches data from `/users/me`."
      actions={["First name", "Last name", "Email state", "Account activity"]}
    >
      <section className="route-panel">
        <p className="feature-card__kicker">Profile data</p>
        {profileQuery.isLoading ? <p>Loading profile.</p> : null}
        {profileQuery.error ? (
          <p>
            {getApiErrorMessage(profileQuery.error, "Failed to load profile.")}
          </p>
        ) : null}
        {profile ? (
          <KeyValueList
            items={[
              { label: "First name", value: profile.firstName },
              { label: "Last name", value: profile.lastName },
              { label: "Email", value: profile.email },
              { label: "Role", value: profile.role },
              { label: "Plan", value: profile.membershipTier },
              {
                label: "Email verification",
                value: profile.isEmailVerified ? "Verified" : "Pending",
              },
            ]}
          />
        ) : null}
      </section>
      <AuthFormShell
        title="Profile update"
        description="Only profile fields are updated via PATCH /users/me."
        statusMessage={statusMessage}
        errorMessage={
          mutation.error
            ? getApiErrorMessage(mutation.error, "Failed to update profile.")
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
          <button
            className="button button--primary"
            type="submit"
            disabled={mutation.isPending || !profile}
          >
            {mutation.isPending ? "Saving" : "Update profile"}
          </button>
        </form>
      </AuthFormShell>
    </RouteSection>
  );
}
