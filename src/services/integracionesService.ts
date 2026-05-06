import api from "../api/axios";
import type { DespidoRRHH } from "../types/DespidoRRHH";

export const obtenerDespidosRRHH = async (): Promise<DespidoRRHH[]> => {
  const response = await api.get("/Integraciones/rrhh/despidos");
  return response.data;
};