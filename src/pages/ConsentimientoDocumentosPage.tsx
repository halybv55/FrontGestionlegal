import { useEffect, useState } from "react";
import Title from "../components/atoms/Title";
import type { ConsentimientoDocumento } from "../types/ConsentimientoDocumento";
import {
  obtenerConsentimientoDocumentosActivos,
  obtenerConsentimientoDocumentosCompletos,
  crearConsentimientoDocumento,
  editarConsentimientoDocumento,
  eliminarConsentimientoDocumento,
} from "../services/consentimientoDocumentoService";

const inicial: ConsentimientoDocumento = {
  codigo: "",
  codigoConsentimiento: "",
  codigoDocumentoLegal: "",
  fechaAsociacion: "",
};

export default function ConsentimientoDocumentosPage() {
  const [relaciones, setRelaciones] = useState<ConsentimientoDocumento[]>([]);
  const [form, setForm] = useState<ConsentimientoDocumento>(inicial);
  const [editando, setEditando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [listaCompleta, setListaCompleta] = useState(false);

  const cargar = async () => {
    const data = listaCompleta
      ? await obtenerConsentimientoDocumentosCompletos()
      : await obtenerConsentimientoDocumentosActivos();

    setRelaciones(data);
  };

  useEffect(() => {
    cargar();
  }, [listaCompleta]);

  const cambiar = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const guardar = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...form,
      fechaAsociacion: form.fechaAsociacion.includes("T")
        ? form.fechaAsociacion
        : `${form.fechaAsociacion}T00:00:00Z`,
    };

    const res = editando
      ? await editarConsentimientoDocumento(form.codigo, payload)
      : await crearConsentimientoDocumento(payload);

    setMensaje(res);
    setForm(inicial);
    setEditando(false);
    cargar();
  };

  const seleccionarEditar = (relacion: ConsentimientoDocumento) => {
    setForm({
      ...relacion,
      fechaAsociacion: relacion.fechaAsociacion?.substring(0, 10),
    });
    setEditando(true);
  };

  const borrar = async (codigo: string) => {
    const confirmar = confirm("¿Seguro que deseas desactivar esta relación?");
    if (!confirmar) return;

    const res = await eliminarConsentimientoDocumento(codigo);
    setMensaje(res);
    cargar();
  };

  return (
    <section>
      <Title>Relación Consentimiento - Documento</Title>

      <p className="subtitle">
        Asocia consentimientos legales con documentos registrados.
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
          name="codigoConsentimiento"
          placeholder="Código consentimiento"
          value={form.codigoConsentimiento}
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

        <input
          type="date"
          name="fechaAsociacion"
          value={form.fechaAsociacion}
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
            <th>Consentimiento</th>
            <th>Documento</th>
            <th>Fecha Asociación</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {relaciones.map((relacion) => (
            <tr key={relacion.codigo}>
              <td>{relacion.codigo}</td>
              <td>{relacion.codigoConsentimiento}</td>
              <td>{relacion.codigoDocumentoLegal}</td>
              <td>{new Date(relacion.fechaAsociacion).toLocaleDateString()}</td>
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