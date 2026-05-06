import Title from "../components/atoms/Title";

export default function DashboardPage() {
  return (
    <section>
      <Title>Gestión Legal</Title>
      <p className="subtitle">
        Sistema de gestión legal para casos, documentos, solicitudes y consentimientos.
      </p>

      <div className="cards">
        <div className="card">
          <h3>Casos legales</h3>
          <p>Consulta y seguimiento de casos legales hospitalarios.</p>
        </div>

        <div className="card">
          <h3>Documentos</h3>
          <p>Gestión de informes, certificados y respaldos legales.</p>
        </div>

        <div className="card">
          <h3>Solicitudes</h3>
          <p>Aprobación legal para compras o procesos especiales.</p>
        </div>
      </div>
    </section>
  );
}