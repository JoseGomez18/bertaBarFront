interface Indicador {
  nombre: string
  valor: string
  descripcion: string
}

const IndicadoresFinancieros = ({ indicadores }: { indicadores: Indicador[] }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-md">
      <h2 className="text-xl font-semibold mb-4">Indicadores Financieros</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {indicadores.map((indicador, index) => (
          <div key={index} className="bg-gray-700 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-2">{indicador.nombre}</h3>
            <p className="text-2xl font-bold text-blue-400 mb-2">{indicador.valor}</p>
            <p className="text-sm text-gray-400">{indicador.descripcion}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default IndicadoresFinancieros

