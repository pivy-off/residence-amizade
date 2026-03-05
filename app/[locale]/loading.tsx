export default function LocaleLoading() {
  return (
    <div
      className="min-h-[50vh] flex items-center justify-center bg-gradient-to-br from-blue-600/20 to-blue-800/20"
      style={{ minHeight: '60vh', padding: 24 }}
    >
      <div className="animate-pulse text-gray-600 font-medium" style={{ fontSize: '1.125rem' }}>
        Chargement...
      </div>
    </div>
  );
}
