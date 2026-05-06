import api from "../api/axios";
import type { SolicitudRevision } from "../types/SolicitudRevision";

export const obtenerRevisionesActivas = async (): Promise<SolicitudRevision[]> => {
  const response = await api.get("/SolicitudRevisions/listaActiva");
  return response.data;
};

export const obtenerRevisionesCompletas = async (): Promise<SolicitudRevision[]> => {
  const response = await api.get("/SolicitudRevisions/listaCompleta");
  return response.data;
};

export const crearRevision = async (revision: SolicitudRevision) => {
  const response = await api.post("/SolicitudRevisions", null, {
    params: revision,
  });

  return response.data;
};

export const editarRevision = async (
  codigo: string,
  revision: SolicitudRevision
) => {
  const response = await api.put(`/SolicitudRevisions/${codigo}`, null, {
    params: revision,
  });

  return response.data;
};

export const eliminarRevision = async (codigo: string) => {
  const response = await api.delete(`/SolicitudRevisions/${codigo}`);
  return response.data;
};