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
  emptyMessage = "No records found.",
}: DataStateProps) {
  if (loading) {
    return <p>Loading data.</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (empty) {
    return <p>{emptyMessage}</p>;
  }

  return null;
}
