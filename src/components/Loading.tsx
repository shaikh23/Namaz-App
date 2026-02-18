export function Loading() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      <div className="text-center">
        <div
          className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
          style={{ borderColor: 'var(--spinner-color)' }}
        />
        <p style={{ color: 'var(--text-secondary)' }}>Loading prayer times...</p>
      </div>
    </div>
  );
}
