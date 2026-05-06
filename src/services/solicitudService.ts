import api from "../api/axios";
import type { Solicitud } from "../types/Solicitud";

export const obtenerSolicitudesActivas = async (): Promise<Solicitud[]> => {
  const response = await api.get("/Solicituds/listaActiva");
  return response.data;
};

export const obtenerSolicitudesCompletas = async (): Promise<Solicitud[]> => {
  const response = await api.get("/Solicituds/listaCompleta");
  return response.data;
};

export const crearSolicitud = async (solicitud: Solicitud) => {
  const response = await api.post("/Solicituds", null, {
    params: solicitud,
  });

  return response.data;
};

export const editarSolicitud = async (codigo: string, solicitud: Solicitud) => {
  const response = await api.put(`/Solicituds/${codigo}`, null, {
    params: solicitud,
  });

  return response.data;
};

export const eliminarSolicitud = async (codigo: string) => {
  const response = await api.delete(`/Solicituds/${codigo}`);
  return response.data;
};