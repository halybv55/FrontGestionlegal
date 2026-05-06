import { useEffect, useState } from "react";
import Title from "../components/atoms/Title";
import {
  obtenerCasosConDocumentos,
  obtenerSolicitudesConRevisiones,
  obtenerConsentimientosFirmados,
  obtenerDocumentosSinCaso,
} from "../services/consultasMisService";

export default function ConsultasMISPage() {
  const [casosDocs, setCasosDocs] = useState<any[]>([]);
  const [solicitudes, setSolicitudes] = useState<any[]>([]);
  const [consentimientos, setConsentimientos] = useState<any[]>([]);
  const [documentosSinCaso, setDocumentosSinCaso] = useState<any[]>([]);

  useEffect(() => {
    obtenerCasosConDocumentos().then(setCasosDocs);
    obtenerSolicitudesConRevisiones().then(setSolicitudes);
    obtenerConsentimientosFirmados().then(setConsentimientos);
    obtenerDocumentosSinCaso().then(setDocumentosSinCaso);
  }, []);

  return (
    <section>
      <Title>Consultas MIS</Title>

      <div className="cards">
        <div className="card">
          <h3>Casos con documentos</h3>
          <p className="stat">{casosDocs.length}</p>
        </div>

        <div className="card">
          <h3>Solicitudes revisadas</h3>
          <p className="stat">{solicitudes.length}</p>
        </div>

        <div className="card">
          <h3>Consentimientos firmados</h3>
          <p className="stat">{consentimientos.length}</p>
        </div>

        <div className="card">
          <h3>Documentos sin caso</h3>
          <p className="stat">{documentosSinCaso.length}</p>
        </div>
      </div>

      <h2 className="section-title">Casos con documentos</h2>

      <table className="table">
        <thead>
          <tr>
            <th>Caso</th>
            <th>Tipo Caso</th>
            <th>Documento</th>
            <th>Tipo Documento</th>
          </tr>
        </thead>
        <tbody>
          {casosDocs.map((item, index) => (
            <tr key={index}>
              <td>{item.codigoCaso}</td>
              <td>{item.tipoCaso}</td>
              <td>{item.codigoDocumento}</td>
              <td>{item.tipo}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}