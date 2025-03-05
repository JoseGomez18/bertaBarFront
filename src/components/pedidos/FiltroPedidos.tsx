import type React from "react"
import { Search } from "lucide-react"

const FiltroPedidos: React.FC = () => {
  return (
    <div className="flex flex-wrap gap-4 items-center">
      <div className="relative flex-1 min-w-[200px]">
        <input
          type="text"
          placeholder="Buscar por mesa o producto"
          className="w-full bg-deep-blue-700 text-white placeholder-gray-400 px-3 py-2 pl-10 rounded focus:outline-none focus:ring-2 focus:ring-accent-blue-500"
        />
        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
      </div>
      <select className="bg-deep-blue-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-accent-blue-500">
        <option value="">Estado del pedido</option>
        <option value="pendiente">Pendiente</option>
        <option value="en_preparacion">En preparación</option>
        <option value="listo">Listo</option>
        <option value="pagado">Pagado</option>
      </select>
      <select className="bg-deep-blue-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-accent-blue-500">
        <option value="">Ordenar por</option>
        <option value="hora_asc">Hora (Ascendente)</option>
        <option value="hora_desc">Hora (Descendente)</option>
        <option value="total_asc">Total (Ascendente)</option>
        <option value="total_desc">Total (Descendente)</option>
      </select>
      <button className="bg-accent-blue-500 hover:bg-accent-blue-400 text-white font-bold py-2 px-4 rounded transition duration-300">
        Aplicar Filtros
      </button>
    </div>
  )
}

export default FiltroPedidos

