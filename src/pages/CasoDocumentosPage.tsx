import { useEffect, useState } from "react";
import Title from "../components/atoms/Title";
import type { CasoDocumento } from "../types/CasoDocumento";
import {
  obtenerCasoDocumentosActivos,
  obtenerCasoDocumentosCompletos,
  crearCasoDocumento,
  editarCasoDocumento,
  eliminarCasoDocumento,
} from "../services/casoDocumentoService";

const inicial: CasoDocumento = {
  codigo: "",
  codigoCasoLegal: "",
  codigoDocumentoLegal: "",
  tipoRelacion: "",
  fechaAdjunta: "",
};

export default function CasoDocumentosPage() {
  const [relaciones, setRelaciones] = useState<CasoDocumento[]>([]);
  const [form, setForm] = useState<CasoDocumento>(inicial);
  const [editando, setEditando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [listaCompleta, setListaCompleta] = useState(false);

  const cargar = async () => {
    const data = listaCompleta
      ? await obtenerCasoDocumentosCompletos()
      : await obtenerCasoDocumentosActivos();

    setRelaciones(data);
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
      fechaAdjunta: form.fechaAdjunta.includes("T")
        ? form.fechaAdjunta
        : `${form.fechaAdjunta}T00:00:00Z`,
    };

    const res = editando
      ? await editarCasoDocumento(form.codigo, payload)
      : await crearCasoDocumento(payload);

    setMensaje(res);
    setForm(inicial);
    setEditando(false);
    cargar();
  };

  const seleccionarEditar = (relacion: CasoDocumento) => {
    setForm({
      ...relacion,
      fechaAdjunta: relacion.fechaAdjunta?.substring(0, 10),
    });
    setEditando(true);
  };

  const borrar = async (codigo: string) => {
    const confirmar = confirm("¿Seguro que deseas desactivar esta relación?");
    if (!confirmar) return;

    const res = await eliminarCasoDocumento(codigo);
    setMensaje(res);
    cargar();
  };

  return (
    <section>
      <Title>Relación Caso - Documento</Title>

      <p className="subtitle">
        Esta sección relaciona casos legales con documentos legales y demuestra la normalización en 5FN.
      </p>

      {mensaje && <p className="message">{mensaje}</p>}

      <form className="form-card" onSubmit={guardar}>
        <input
          name="codigo"
          placeholder="Código relación"
          value={form.codigo}
          onChange={cambiar}
          disabled={editando}
          required
        />

        <input
          name="codigoCasoLegal"
          placeholder="Código caso legal"
          value={form.codigoCasoLegal}
          onChange={cambiar}
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
          name="tipoRelacion"
          value={form.tipoRelacion}
          onChange={cambiar}
          required
        >
          <option value="">Tipo de relación</option>
          <option value="Evidencia">Evidencia</option>
          <option value="Soporte">Soporte</option>
          <option value="Informe asociado">Informe asociado</option>
          <option value="Documento probatorio">Documento probatorio</option>
        </select>

        <input
          type="date"
          name="fechaAdjunta"
          value={form.fechaAdjunta}
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
            <th>Caso Legal</th>
            <th>Documento Legal</th>
            <th>Tipo Relación</th>
            <th>Fecha Adjunta</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {relaciones.map((relacion) => (
            <tr key={relacion.codigo}>
              <td>{relacion.codigo}</td>
              <td>{relacion.codigoCasoLegal}</td>
              <td>{relacion.codigoDocumentoLegal}</td>
              <td>{relacion.tipoRelacion}</td>
              <td>{new Date(relacion.fechaAdjunta).toLocaleDateString()}</td>
              <td>
                <button
                  className="mini-btn"
                  onClick={() => seleccionarEditar(relacion)}
                >
                  Editar
                </button>

                <button
                  className="mini-btn danger"
                  onClick={() => borrar(relacion.codigo)}
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