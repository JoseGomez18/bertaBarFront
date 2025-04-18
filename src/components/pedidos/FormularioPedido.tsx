"use client"

import { useState } from "react"
import { Plus, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog"

const FormularioPedidoModal = () => {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="bg-blue-500/20 text-blue-400 border border-blue-500/50 rounded-lg px-4 py-2 font-medium hover:bg-blue-500/30 transition-colors flex items-center justify-center">
          <Plus className="w-5 h-5 mr-2" />
          Nuevo Pedido
        </button>
      </DialogTrigger>
      <DialogContent className="bg-[#0F2942]/50 backdrop-blur-sm border border-[#1A3A54]/50 text-white p-0 max-w-md">
        <DialogHeader className="p-5 pb-0">
          <div className="flex justify-between items-center">
            <DialogTitle className="text-lg font-semibold text-white">Nuevo Pedido</DialogTitle>
            <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
        </DialogHeader>
        <div className="p-5">
          <form className="space-y-4">
            <div>
              <label htmlFor="mesa" className="block text-sm font-medium text-gray-400 mb-1">
                Número de Mesa
              </label>
              <input
                type="number"
                id="mesa"
                className="w-full bg-[#1A3A54]/50 border border-[#1A3A54] text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                placeholder="Ej: 5"
              />
            </div>

            <div>
              <label htmlFor="categoria" className="block text-sm font-medium text-gray-400 mb-1">
                Categoría
              </label>
              <select
                id="categoria"
                className="w-full bg-[#1A3A54]/50 border border-[#1A3A54] text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                <option value="">Seleccionar categoría</option>
                <option value="bebidas">Bebidas</option>
                <option value="cervezas">Cervezas</option>
                <option value="cocktails">Cocktails</option>
                <option value="comidas">Comidas</option>
              </select>
            </div>

            <div>
              <label htmlFor="producto" className="block text-sm font-medium text-gray-400 mb-1">
                Producto
              </label>
              <select
                id="producto"
                className="w-full bg-[#1A3A54]/50 border border-[#1A3A54] text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                <option value="">Seleccionar producto</option>
                <option value="cerveza">Cerveza Artesanal</option>
                <option value="margarita">Margarita</option>
                <option value="mojito">Mojito</option>
                <option value="nachos">Nachos</option>
              </select>
            </div>

            <div>
              <label htmlFor="cantidad" className="block text-sm font-medium text-gray-400 mb-1">
                Cantidad
              </label>
              <input
                type="number"
                id="cantidad"
                className="w-full bg-[#1A3A54]/50 border border-[#1A3A54] text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                placeholder="Cantidad"
                min="1"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500/20 text-blue-400 border border-blue-500/50 rounded-lg px-4 py-2 font-medium hover:bg-blue-500/30 transition-colors flex items-center justify-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Agregar al Pedido
            </button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default FormularioPedidoModal

