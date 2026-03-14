import { useQuery } from "@tanstack/react-query";

import { KeyValueList } from "../components/data/KeyValueList";
import { getApiErrorMessage } from "../lib/api-errors";
import { queryKeys } from "../lib/queryKeys";
import { RouteSection } from "../components/routes/RouteSection";
import { fetchUserProfile } from "../users/users.api";

export function ProfilePage() {
  const profileQuery = useQuery({
    queryKey: queryKeys.userProfile,
    queryFn: fetchUserProfile,
  });

  const profile = profileQuery.data;

  return (
    <RouteSection
      eyebrow="User area"
      title="Profile route kullanici bilgilerini izole eder."
      description="Bu sayfa artik `/users/me` verisini cekiyor."
      actions={["First name", "Last name", "Email state", "Account activity"]}
    >
      <section className="route-panel">
        <p className="feature-card__kicker">Profile data</p>
        {profileQuery.isLoading ? <p>Profil yukleniyor.</p> : null}
        {profileQuery.error ? (
          <p>{getApiErrorMessage(profileQuery.error, "Profil okunamadi.")}</p>
        ) : null}
        {profile ? (
          <KeyValueList
            items={[
              { label: "Ad", value: profile.firstName },
              { label: "Soyad", value: profile.lastName },
              { label: "E-posta", value: profile.email },
              { label: "Rol", value: profile.role },
              { label: "Plan", value: profile.membershipTier },
              {
                label: "E-posta dogrulama",
                value: profile.isEmailVerified ? "Verified" : "Pending",
              },
            ]}
          />
        ) : null}
      </section>
    </RouteSection>
  );
}
