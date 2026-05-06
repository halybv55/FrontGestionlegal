import api from "../api/axios";
import type { CasoDocumento } from "../types/CasoDocumento";

export const obtenerCasoDocumentosActivos = async (): Promise<CasoDocumento[]> => {
  const response = await api.get("/CasoDocumentoes/listaActiva");
  return response.data;
};

export const obtenerCasoDocumentosCompletos = async (): Promise<CasoDocumento[]> => {
  const response = await api.get("/CasoDocumentoes/listaCompleta");
  return response.data;
};

export const crearCasoDocumento = async (relacion: CasoDocumento) => {
  const response = await api.post("/CasoDocumentoes", null, {
    params: relacion,
  });

  return response.data;
};

export const editarCasoDocumento = async (
  codigo: string,
  relacion: CasoDocumento
) => {
  const response = await api.put(`/CasoDocumentoes/${codigo}`, null, {
    params: relacion,
  });

  return response.data;
};

export const eliminarCasoDocumento = async (codigo: string) => {
  const response = await api.delete(`/CasoDocumentoes/${codigo}`);
  return response.data;
};