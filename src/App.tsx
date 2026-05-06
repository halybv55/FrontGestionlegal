import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import Navbar from "./components/organisms/Navbar";


import DashboardPage from "./pages/DashboardPage";
import CasosPage from "./pages/CasosPage";
import DocumentosPage from "./pages/DocumentosPage";
import SolicitudesPage from "./pages/SolicitudesPage";
import ConsentimientosPage from "./pages/ConsentimientosPage";
import ReglasPage from "./pages/ReglasPage";
import ConsultasMISPage from "./pages/ConsultasMISPage";
import SolicitudRevisionsPage from "./pages/SolicitudRevisionsPage";
import CasoDocumentosPage from "./pages/CasoDocumentosPage.tsx";
import DocumentoDecisionsPage from "./pages/DocumentoDecisionsPage";
import ConsentimientoDocumentosPage from "./pages/ConsentimientoDocumentosPage";
import CasoInvolucradosPage from "./pages/CasoInvolucradosPage";
import IntegracionesPage from "./pages/IntegracionesPage";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <div className="layout">
        <aside className="sidebar">
          <Link to="/">Dashboard</Link>
          <Link to="/casos">Casos legales</Link>
          <Link to="/documentos">Documentos</Link>
          <Link to="/solicitudes">Solicitudes</Link>
          <Link to="/consentimientos">Consentimientos</Link>
          <Link to="/reglas">Reglas</Link>
          <Link to="/mis">Consultas MIS</Link>
          <Link to="/revisiones">Revisiones</Link>
          <Link to="/caso-documentos">Caso Documento</Link>
          <Link to="/documento-decisiones">Documento Decisión</Link>
          <Link to="/consentimiento-documentos">Consentimiento Documento</Link>
          <Link to="/caso-involucrados">Caso Involucrados</Link>
          <Link to="/integraciones">Integraciones</Link>
        </aside>

        <main className="content">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/casos" element={<CasosPage />} />
            <Route path="/documentos" element={<DocumentosPage />} />
            <Route path="/solicitudes" element={<SolicitudesPage />} />
            <Route path="/consentimientos" element={<ConsentimientosPage />} />
            <Route path="/reglas" element={<ReglasPage />} />
            <Route path="/mis" element={<ConsultasMISPage />} />
            <Route path="/revisiones" element={<SolicitudRevisionsPage />} />
            <Route path="/caso-documentos" element={<CasoDocumentosPage />} />
            <Route path="/documento-decisiones" element={<DocumentoDecisionsPage />} />
            <Route path="/consentimiento-documentos" element={<ConsentimientoDocumentosPage />} />
            <Route path="/caso-involucrados" element={<CasoInvolucradosPage />} />
            <Route path="/integraciones" element={<IntegracionesPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;