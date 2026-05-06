import { useEffect, useState } from "react";
import Title from "../components/atoms/Title";
import type { DocumentoDecision } from "../types/DocumentoDecision";
import {
  obtenerDocumentoDecisionesActivas,
  obtenerDocumentoDecisionesCompletas,
  crearDocumentoDecision,
  editarDocumentoDecision,
  eliminarDocumentoDecision,
} from "../services/documentoDecisionService";

const inicial: DocumentoDecision = {
  codigo: "",
  codigoDocumentoLegal: "",
  tipoDecision: "",
  fechaDecision: "",
  observacion: "",
};

export default function DocumentoDecisionsPage() {
  const [decisiones, setDecisiones] = useState<DocumentoDecision[]>([]);
  const [form, setForm] = useState<DocumentoDecision>(inicial);
  const [editando, setEditando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [listaCompleta, setListaCompleta] = useState(false);

  const cargar = async () => {
    const data = listaCompleta
      ? await obtenerDocumentoDecisionesCompletas()
      : await obtenerDocumentoDecisionesActivas();

    setDecisiones(data);
  };

  useEffect(() => {
    cargar();
  }, [listaCompleta]);

  const cambiar = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const guardar = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...form,
      fechaDecision: form.fechaDecision.includes("T")
        ? form.fechaDecision
        : `${form.fechaDecision}T00:00:00Z`,
    };

    const res = editando
      ? await editarDocumentoDecision(form.codigo, payload)
      : await crearDocumentoDecision(payload);

    setMensaje(res);
    setForm(inicial);
    setEditando(false);
    cargar();
  };

  const seleccionarEditar = (decision: DocumentoDecision) => {
    setForm({
      ...decision,
      fechaDecision: decision.fechaDecision?.substring(0, 10),
    });
    setEditando(true);
  };

  const borrar = async (codigo: string) => {
    const confirmar = confirm("¿Seguro que deseas desactivar esta decisión?");
    if (!confirmar) return;

    const res = await eliminarDocumentoDecision(codigo);
    setMensaje(res);
    cargar();
  };

  return (
    <section>
      <Title>Decisiones sobre Documentos</Title>

      <p className="subtitle">
        Aquí se registra si un documento legal fue aprobado, rechazado u observado.
      </p>

      {mensaje && <p className="message">{mensaje}</p>}

      <form className="form-card" onSubmit={guardar}>
        <input
          name="codigo"
          placeholder="Código decisión"
          value={form.codigo}
          onChange={cambiar}
          disabled={editando}
          required
        />

        <input
          name="codigoDocumentoLegal"
          placeholder="Código documento legal"
          value={form.codigoDocumentoLegal}
          onChange={cambiar}
          required
        />

        <select
          name="tipoDecision"
          value={form.tipoDecision}
          onChange={cambiar}
          required
        >
          <option value="">Tipo decisión</option>
          <option value="Aprobado">Aprobado</option>
          <option value="Rechazado">Rechazado</option>
          <option value="Observado">Observado</option>
        </select>

        <input
          type="date"
          name="fechaDecision"
          value={form.fechaDecision}
          onChange={cambiar}
          required
        />

        <input
          name="observacion"
          placeholder="Observación"
          value={form.observacion}
          onChange={cambiar}
          required
        />

        <button className="btn" type="submit">
          {editando ? "Actualizar" : "Crear"}
        </button>

        {editando && (
          <button
            className="btn secondary"
            type="button"
            onClick={() => {
              setForm(inicial);
              setEditando(false);
            }}
          >
            Cancelar
          </button>
        )}
      </form>

      <div className="toolbar">
        <button className="btn" onClick={() => setListaCompleta(false)}>
          Lista activa
        </button>

        <button className="btn secondary" onClick={() => setListaCompleta(true)}>
          Lista completa
        </button>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Código</th>
            <th>Documento</th>
            <th>Decisión</th>
            <th>Fecha</th>
            <th>Observación</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {decisiones.map((decision) => (
            <tr key={decision.codigo}>
              <td>{decision.codigo}</td>
              <td>{decision.codigoDocumentoLegal}</td>
              <td>
                <span
                  className={
                    decision.tipoDecision === "Aprobado"
                      ? "badge success"
                      : decision.tipoDecision === "Rechazado"
                      ? "badge danger"
                      : "badge"
                  }
                >
                  {decision.tipoDecision}
                </span>
              </td>
              <td>{new Date(decision.fechaDecision).toLocaleDateString()}</td>
              <td>{decision.observacion}</td>
              <td>
                <button
                  className="mini-btn"
                  onClick={() => seleccionarEditar(decision)}
                >
                  Editar
                </button>

                <button
                  className="mini-btn danger"
                  onClick={() => borrar(decision.codigo)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}