import api from "../api/axios";
import type { CasoInvolucrado } from "../types/CasoInvolucrado";

export const obtenerCasoInvolucradosActivos = async (): Promise<CasoInvolucrado[]> => {
  const response = await api.get("/CasoInvolucradoes/listaActiva");
  return response.data;
};

export const obtenerCasoInvolucradosCompletos = async (): Promise<CasoInvolucrado[]> => {
  const response = await api.get("/CasoInvolucradoes/listaCompleta");
  return response.data;
};

export const crearCasoInvolucrado = async (involucrado: CasoInvolucrado) => {
  const response = await api.post("/CasoInvolucradoes", null, {
    params: involucrado,
  });

  return response.data;
};

export const editarCasoInvolucrado = async (
  codigo: string,
  involucrado: CasoInvolucrado
) => {
  const response = await api.put(`/CasoInvolucradoes/${codigo}`, null, {
    params: involucrado,
  });

  return response.data;
};

export const eliminarCasoInvolucrado = async (codigo: string) => {
  const response = await api.delete(`/CasoInvolucradoes/${codigo}`);
  return response.data;
};