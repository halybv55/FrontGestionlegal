import api from "../api/axios";
import type { DocumentoLegal } from "../types/DocumentoLegal";

export const obtenerDocumentosActivos = async (): Promise<DocumentoLegal[]> => {
  const response = await api.get("/DocumentoLegals/listaActiva");
  return response.data;
};

export const obtenerDocumentosCompletos = async (): Promise<DocumentoLegal[]> => {
  const response = await api.get("/DocumentoLegals/listaCompleta");
  return response.data;
};

export const crearDocumento = async (documento: DocumentoLegal) => {
  const response = await api.post("/DocumentoLegals", null, {
    params: documento,
  });

  return response.data;
};

export const editarDocumento = async (
  codigo: string,
  documento: DocumentoLegal
) => {
  const response = await api.put(`/DocumentoLegals/${codigo}`, null, {
    params: documento,
  });

  return response.data;
};

export const eliminarDocumento = async (codigo: string) => {
  const response = await api.delete(`/DocumentoLegals/${codigo}`);
  return response.data;
};