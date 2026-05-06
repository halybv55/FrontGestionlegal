import api from "../api/axios";

export const obtenerCasosConDocumentos = async () => {
  const response = await api.get("/ConsultasMIS/casos-con-documentos");
  return response.data;
};

export const obtenerSolicitudesConRevisiones = async () => {
  const response = await api.get("/ConsultasMIS/solicitudes-con-revisiones");
  return response.data;
};

export const obtenerConsentimientosFirmados = async () => {
  const response = await api.get("/ConsultasMIS/consentimientos-firmados");
  return response.data;
};

export const obtenerDocumentosSinCaso = async () => {
  const response = await api.get("/ConsultasMIS/documentos-sin-caso");
  return response.data;
};