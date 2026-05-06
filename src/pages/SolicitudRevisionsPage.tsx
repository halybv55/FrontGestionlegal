import { useEffect, useState } from "react";
import Title from "../components/atoms/Title";
import type { SolicitudRevision } from "../types/SolicitudRevision";
import {
  obtenerRevisionesActivas,
  obtenerRevisionesCompletas,
  crearRevision,
  editarRevision,
  eliminarRevision,
} from "../services/solicitudRevisionService";

const inicial: SolicitudRevision = {
  codigo: "",
  codigoSolicitud: "",
  fechaRevision: "",
  resultado: "",
  observaciones: "",
};

export default function SolicitudRevisionsPage() {
  const [revisiones, setRevisiones] = useState<SolicitudRevision[]>([]);
  const [form, setForm] = useState<SolicitudRevision>(inicial);
  const [editando, setEditando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [listaCompleta, setListaCompleta] = useState(false);

  const cargar = async () => {
    const data = listaCompleta
      ? await obtenerRevisionesCompletas()
      : await obtenerRevisionesActivas();

    setRevisiones(data);
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
      fechaRevision: form.fechaRevision.includes("T")
        ? form.fechaRevision
        : `${form.fechaRevision}T00:00:00Z`,
    };

    const res = editando
      ? await editarRevision(form.codigo, payload)
      : await crearRevision(payload);

    setMensaje(res);
    setForm(inicial);
    setEditando(false);
    cargar();
  };

  const seleccionarEditar = (revision: SolicitudRevision) => {
    setForm({
      ...revision,
      fechaRevision: revision.fechaRevision?.substring(0, 10),
    });
    setEditando(true);
  };

  const borrar = async (codigo: string) => {
    const confirmar = confirm("¿Seguro que deseas desactivar esta revisión?");
    if (!confirmar) return;

    const res = await eliminarRevision(codigo);
    setMensaje(res);
    cargar();
  };

  return (
    <section>
      <Title>Revisión de Solicitudes</Title>

      {mensaje && <p className="message">{mensaje}</p>}

      <form className="form-card" onSubmit={guardar}>
        <input
          name="codigo"
          placeholder="Código revisión"
          value={form.codigo}
          onChange={cambiar}
          disabled={editando}
          required
        />

        <input
          name="codigoSolicitud"
          placeholder="Código solicitud"
          value={form.codigoSolicitud}
          onChange={cambiar}
          required
        />

        <input
          type="date"
          name="fechaRevision"
          value={form.fechaRevision}
          onChange={cambiar}
          required
        />

        <select
          name="resultado"
          value={form.resultado}
          onChange={cambiar}
          required
        >
          <option value="">Resultado</option>
          <option value="Aprobado">Aprobado</option>
          <option value="Rechazado">Rechazado</option>
          <option value="Observado">Observado</option>
        </select>

        <input
          name="observaciones"
          placeholder="Observaciones"
          value={form.observaciones}
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
            <th>Solicitud</th>
            <th>Fecha</th>
            <th>Resultado</th>
            <th>Observaciones</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {revisiones.map((revision) => (
            <tr key={revision.codigo}>
              <td>{revision.codigo}</td>
              <td>{revision.codigoSolicitud}</td>
              <td>{new Date(revision.fechaRevision).toLocaleDateString()}</td>
              <td>
                <span
                  className={
                    revision.resultado === "Aprobado"
                      ? "badge success"
                      : revision.resultado === "Rechazado"
                      ? "badge danger"
                      : "badge"
                  }
                >
                  {revision.resultado}
                </span>
              </td>
              <td>{revision.observaciones}</td>
              <td>
                <button
                  className="mini-btn"
                  onClick={() => seleccionarEditar(revision)}
                >
                  Editar
                </button>

                <button
                  className="mini-btn danger"
                  onClick={() => borrar(revision.codigo)}
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