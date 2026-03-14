type InfoCard = {
  title: string;
  text: string;
  items?: string[];
};

type InfoGridProps = {
  cards: InfoCard[];
};

export function InfoGrid({ cards }: InfoGridProps) {
  return (
    <section className="content-grid" aria-label="Page details">
      {cards.map((card) => (
        <article key={card.title} className="feature-card">
          <p className="feature-card__kicker">{card.title}</p>
          <h3>{card.text}</h3>
          {card.items?.length ? (
            <ul>
              {card.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </article>
      ))}
    </section>
  );
}
