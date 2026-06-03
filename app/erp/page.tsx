export default function Dashboard() {
  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-bold">
        Dashboard
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">

        <div className="bg-white p-4 rounded-xl border">
          <p className="text-sm text-gray-500">Inventario bajo</p>
          <p className="text-xl font-bold">12</p>
        </div>

        <div className="bg-white p-4 rounded-xl border">
          <p className="text-sm text-gray-500">Cotizaciones</p>
          <p className="text-xl font-bold">8</p>
        </div>

        <div className="bg-white p-4 rounded-xl border">
          <p className="text-sm text-gray-500">Rentas activas</p>
          <p className="text-xl font-bold">5</p>
        </div>

        <div className="bg-white p-4 rounded-xl border">
          <p className="text-sm text-gray-500">Ingresos</p>
          <p className="text-xl font-bold">$24,500</p>
        </div>

      </div>

      {/* Actividad */}
      <div className="bg-white p-6 border rounded-xl">
        <h2 className="font-semibold mb-4">
          Actividad reciente
        </h2>

        <ul className="text-sm text-gray-600 space-y-2">
          <li>• Se actualizó precio de Mini Split</li>
          <li>• Nueva cotización creada</li>
          <li>• Maquinaria rentada</li>
        </ul>
      </div>

    </div>
  );
}