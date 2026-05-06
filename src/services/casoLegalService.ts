import api from "../api/axios";
import type { CasoLegal } from "../types/CasoLegal";

export const obtenerCasosActivos = async () => {
  const res = await api.get("/CasoLegals/listaActiva");
  return res.data;
};

export const obtenerCasosCompletos = async () => {
  const res = await api.get("/CasoLegals/listaCompleta");
  return res.data;
};

export const crearCaso = async (caso: CasoLegal) => {
  const res = await api.post("/CasoLegals", null, { params: caso });
  return res.data;
};

export const editarCaso = async (codigo: string, caso: CasoLegal) => {
  const res = await api.put(`/CasoLegals/${codigo}`, null, { params: caso });
  return res.data;
};

export const eliminarCaso = async (codigo: string) => {
  const res = await api.delete(`/CasoLegals/${codigo}`);
  return res.data;
};