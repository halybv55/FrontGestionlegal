import api from "../api/axios";
import type { DocumentoDecision } from "../types/DocumentoDecision";

export const obtenerDocumentoDecisionesActivas = async (): Promise<DocumentoDecision[]> => {
  const response = await api.get("/DocumentoDecisions/listaActiva");
  return response.data;
};

export const obtenerDocumentoDecisionesCompletas = async (): Promise<DocumentoDecision[]> => {
  const response = await api.get("/DocumentoDecisions/listaCompleta");
  return response.data;
};

export const crearDocumentoDecision = async (decision: DocumentoDecision) => {
  const response = await api.post("/DocumentoDecisions", null, {
    params: decision,
  });

  return response.data;
};

export const editarDocumentoDecision = async (
  codigo: string,
  decision: DocumentoDecision
) => {
  const response = await api.put(`/DocumentoDecisions/${codigo}`, null, {
    params: decision,
  });

  return response.data;
};

export const eliminarDocumentoDecision = async (codigo: string) => {
  const response = await api.delete(`/DocumentoDecisions/${codigo}`);
  return response.data;
};