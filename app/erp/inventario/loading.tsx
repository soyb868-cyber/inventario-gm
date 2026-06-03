export default function Loading() {
  return (
    <div className="space-y-4">

      <div className="h-10 w-64 bg-gray-200 rounded animate-pulse" />

      <div className="bg-white border rounded-xl p-6 space-y-4">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-12 bg-gray-100 rounded animate-pulse"
          />
        ))}
      </div>

    </div>
  );
}