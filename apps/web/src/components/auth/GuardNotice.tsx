type GuardNoticeProps = {
  title: string;
  description: string;
  actionLabel?: string;
};

export function GuardNotice({
  title,
  description,
  actionLabel = "Restricted route",
}: GuardNoticeProps) {
  return (
    <section className="guard-notice">
      <p className="feature-card__kicker">{actionLabel}</p>
      <h3>{title}</h3>
      <p>{description}</p>
    </section>
  );
}
