import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useAuth } from "../../auth/AuthContext";
import { logoutMutation } from "../../auth/auth.mutations";
import { getApiErrorMessage } from "../../lib/api-errors";
import { queryKeys } from "../../lib/queryKeys";

export function AuthStatusPanel() {
  const { user, isLoading, errorMessage } = useAuth();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: logoutMutation,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.authMe }),
        queryClient.invalidateQueries({ queryKey: queryKeys.userProfile }),
        queryClient.invalidateQueries({ queryKey: queryKeys.userSessions }),
      ]);
    },
  });

  return (
    <section className="auth-switcher" aria-label="Session status">
      <div>
        <p className="feature-card__kicker">Session state</p>
        <strong>
          {isLoading
            ? "Session loading"
            : user
              ? `${user.role} / ${user.membershipTier}`
              : "Anonymous visitor"}
        </strong>
      </div>

      <div className="auth-status-copy">
        <p>
          {errorMessage
            ? "API baglantisi kurulamadi veya session okunamadi."
            : user
              ? `${user.firstName} ${user.lastName} olarak oturum acik.`
              : "Protected route'lar login olmadan login ekranina yonlenir."}
        </p>
        {mutation.error ? (
          <p>{getApiErrorMessage(mutation.error, "Logout islemi basarisiz.")}</p>
        ) : null}
        {user ? (
          <button
            className="button button--secondary"
            type="button"
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Cikis yapiliyor" : "Logout"}
          </button>
        ) : null}
      </div>
    </section>
  );
}
