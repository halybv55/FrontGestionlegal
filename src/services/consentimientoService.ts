import api from "../api/axios";
import type { Consentimiento } from "../types/Consentimiento";

export const obtenerConsentimientosActivos = async (): Promise<Consentimiento[]> => {
  const response = await api.get("/Consentimientoes/listaActiva");
  return response.data;
};

export const obtenerConsentimientosCompletos = async (): Promise<Consentimiento[]> => {
  const response = await api.get("/Consentimientoes/listaCompleta");
  return response.data;
};

export const crearConsentimiento = async (consentimiento: Consentimiento) => {
  const response = await api.post("/Consentimientoes", null, {
    params: consentimiento,
  });

  return response.data;
};

export const editarConsentimiento = async (
  codigo: string,
  consentimiento: Consentimiento
) => {
  const response = await api.put(`/Consentimientoes/${codigo}`, null, {
    params: consentimiento,
  });

  return response.data;
};

export const eliminarConsentimiento = async (codigo: string) => {
  const response = await api.delete(`/Consentimientoes/${codigo}`);
  return response.data;
};