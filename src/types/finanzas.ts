export type TipoAlerta = "warning" | "info" | "danger" | "success";

export type Alerta = {
  tipo: TipoAlerta;
  mensaje: string;
};

export type TipoTransaccion = "ingreso" | "gasto";

export type Transaccion = {
  id: number;
  descripcion: string;
  monto: number;
  fecha: string;
  tipo: TipoTransaccion;
};

export type VentaPorCategoria = {
  categoria: string;
  monto: number;
};

export type RendimientoMensual = {
  mes: string;
  ingresos: number;
  gastos: number;
};

export type IndicadorFinanciero = {
  nombre: string;
  valor: string;
  descripcion: string;
};

export type MetaFinanciera = {
  nombre: string;
  meta: number;
  actual: number;
};

export type DatosFinancieros = {
  balance: number;
  ingresos: number;
  gastos: number;
  transacciones: Transaccion[];
  ventasPorCategoria: VentaPorCategoria[];
  rendimientoMensual: RendimientoMensual[];
  indicadoresFinancieros: IndicadorFinanciero[];
  metasFinancieras: MetaFinanciera[];
  alertas: Alerta[];
};
