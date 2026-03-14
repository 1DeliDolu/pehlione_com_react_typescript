type KeyValueListProps = {
  items: Array<{ label: string; value: string }>;
};

export function KeyValueList({ items }: KeyValueListProps) {
  return (
    <dl className="kv-list">
      {items.map((item) => (
        <div key={item.label} className="kv-list__row">
          <dt>{item.label}</dt>
          <dd>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
