import api from "../api/axios";
import type { Regla } from "../types/Regla";

export const obtenerReglasActivas = async (): Promise<Regla[]> => {
  const response = await api.get("/Reglas/listaActiva");
  return response.data;
};

export const obtenerReglasCompletas = async (): Promise<Regla[]> => {
  const response = await api.get("/Reglas/listaCompleta");
  return response.data;
};

export const crearRegla = async (regla: Regla) => {
  const response = await api.post("/Reglas", null, {
    params: regla,
  });

  return response.data;
};

export const editarRegla = async (codigo: string, regla: Regla) => {
  const response = await api.put(`/Reglas/${codigo}`, null, {
    params: regla,
  });

  return response.data;
};

export const eliminarRegla = async (codigo: string) => {
  const response = await api.delete(`/Reglas/${codigo}`);
  return response.data;
};