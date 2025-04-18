interface RendimientoMes {
  mes: string
  ingresos: number
  gastos: number
}

const RendimientoMensual = ({ rendimiento }: { rendimiento: RendimientoMes[] }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-md overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4">Rendimiento Mensual</h2>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-gray-400">
            <th className="text-left py-3 px-4">Mes</th>
            <th className="text-right py-3 px-4">Ingresos</th>
            <th className="text-right py-3 px-4">Gastos</th>
            <th className="text-right py-3 px-4">Beneficio</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {rendimiento.map((mes, index) => {
            const beneficio = mes.ingresos - mes.gastos
            return (
              <tr key={index}>
                <td className="py-3 px-4">{mes.mes}</td>
                <td className="text-right py-3 px-4 text-green-400">
                  {new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP" }).format(mes.ingresos)}
                </td>
                <td className="text-right py-3 px-4 text-red-400">
                  {new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP" }).format(mes.gastos)}
                </td>
                <td className="text-right py-3 px-4 text-blue-400 font-medium">
                  {new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP" }).format(beneficio)}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default RendimientoMensual

