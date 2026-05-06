import { useEffect, useState } from "react";
import Title from "../components/atoms/Title";
import { obtenerDespidosRRHH } from "../services/integracionesService";
import type { DespidoRRHH } from "../types/DespidoRRHH";

export default function IntegracionesPage() {
  const [despidos, setDespidos] = useState<DespidoRRHH[]>([]);

  useEffect(() => {
    obtenerDespidosRRHH().then(setDespidos);
  }, []);

  return (
    <section>
      <Title>Integración RRHH</Title>

      <table className="table">
        <thead>
          <tr>
            <th>Empleado ID</th>
            <th>Motivo</th>
            <th>Fecha despido</th>
            <th>Registrado por</th>
          </tr>
        </thead>

        <tbody>
          {despidos.map((d, index) => (
            <tr key={index}>
              <td>{d.empleadoId}</td>
              <td>{d.motivo}</td>
              <td>{new Date(d.fechaDespido).toLocaleDateString()}</td>
              <td>{d.registradoPor}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}