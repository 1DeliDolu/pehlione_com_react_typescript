type DataStateProps = {
  loading?: boolean;
  error?: string | null;
  empty?: boolean;
  emptyMessage?: string;
};

export function DataState({
  loading,
  error,
  empty,
  emptyMessage = "Kayit bulunamadi.",
}: DataStateProps) {
  if (loading) {
    return <p>Veri yukleniyor.</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (empty) {
    return <p>{emptyMessage}</p>;
  }

  return null;
}
