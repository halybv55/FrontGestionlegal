import api from "../api/axios";
import type { ConsentimientoDocumento } from "../types/ConsentimientoDocumento";

export const obtenerConsentimientoDocumentosActivos = async (): Promise<ConsentimientoDocumento[]> => {
  const response = await api.get("/ConsentimientoDocumentoes/listaActiva");
  return response.data;
};

export const obtenerConsentimientoDocumentosCompletos = async (): Promise<ConsentimientoDocumento[]> => {
  const response = await api.get("/ConsentimientoDocumentoes/listaCompleta");
  return response.data;
};

export const crearConsentimientoDocumento = async (
  relacion: ConsentimientoDocumento
) => {
  const response = await api.post("/ConsentimientoDocumentoes", null, {
    params: relacion,
  });

  return response.data;
};

export const editarConsentimientoDocumento = async (
  codigo: string,
  relacion: ConsentimientoDocumento
) => {
  const response = await api.put(`/ConsentimientoDocumentoes/${codigo}`, null, {
    params: relacion,
  });

  return response.data;
};

export const eliminarConsentimientoDocumento = async (codigo: string) => {
  const response = await api.delete(`/ConsentimientoDocumentoes/${codigo}`);
  return response.data;
};