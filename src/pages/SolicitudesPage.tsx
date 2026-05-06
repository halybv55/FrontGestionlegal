import { useEffect, useState } from "react";
import Title from "../components/atoms/Title";
import type { Solicitud } from "../types/Solicitud";
import {
  obtenerSolicitudesActivas,
  obtenerSolicitudesCompletas,
  crearSolicitud,
  editarSolicitud,
  eliminarSolicitud,
} from "../services/solicitudService";

const inicial: Solicitud = {
  codigo: "",
  tipoSolicitud: "",
  motivo: "",
  descripcion: "",
  fechaSolicitud: "",
};

export default function SolicitudesPage() {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [form, setForm] = useState<Solicitud>(inicial);
  const [editando, setEditando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [listaCompleta, setListaCompleta] = useState(false);

  const cargar = async () => {
    const data = listaCompleta
      ? await obtenerSolicitudesCompletas()
      : await obtenerSolicitudesActivas();

    setSolicitudes(data);
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
      fechaSolicitud: form.fechaSolicitud.includes("T")
        ? form.fechaSolicitud
        : `${form.fechaSolicitud}T00:00:00Z`,
    };

    const res = editando
      ? await editarSolicitud(form.codigo, payload)
      : await crearSolicitud(payload);

    setMensaje(res);
    setForm(inicial);
    setEditando(false);
    cargar();
  };

  const seleccionarEditar = (solicitud: Solicitud) => {
    setForm({
      ...solicitud,
      fechaSolicitud: solicitud.fechaSolicitud?.substring(0, 10),
    });
    setEditando(true);
  };

  const borrar = async (codigo: string) => {
    const confirmar = confirm("¿Seguro que deseas desactivar esta solicitud?");
    if (!confirmar) return;

    const res = await eliminarSolicitud(codigo);
    setMensaje(res);
    cargar();
  };

  return (
    <section>
      <Title>Solicitudes Legales</Title>

      {mensaje && <p className="message">{mensaje}</p>}

      <form className="form-card" onSubmit={guardar}>
        <input
          name="codigo"
          placeholder="Código"
          value={form.codigo}
          onChange={cambiar}
          disabled={editando}
          required
        />

        <select
          name="tipoSolicitud"
          value={form.tipoSolicitud}
          onChange={cambiar}
          required
        >
          <option value="">Tipo de solicitud</option>
          <option value="Compra de fármaco">Compra de fármaco</option>
          <option value="Autorización legal">Autorización legal</option>
          <option value="Convenio">Convenio</option>
          <option value="Contrato">Contrato</option>
          <option value="Permiso especial">Permiso especial</option>
        </select>

        <input
          name="motivo"
          placeholder="Motivo"
          value={form.motivo}
          onChange={cambiar}
          required
        />

        <input
          name="descripcion"
          placeholder="Descripción"
          value={form.descripcion}
          onChange={cambiar}
          required
        />

        <input
          type="date"
          name="fechaSolicitud"
          value={form.fechaSolicitud}
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
            <th>Tipo</th>
            <th>Motivo</th>
            <th>Descripción</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {solicitudes.map((solicitud) => (
            <tr key={solicitud.codigo}>
              <td>{solicitud.codigo}</td>
              <td>{solicitud.tipoSolicitud}</td>
              <td>{solicitud.motivo}</td>
              <td>{solicitud.descripcion}</td>
              <td>{new Date(solicitud.fechaSolicitud).toLocaleDateString()}</td>
              <td>
                <button
                  className="mini-btn"
                  onClick={() => seleccionarEditar(solicitud)}
                >
                  Editar
                </button>

                <button
                  className="mini-btn danger"
                  onClick={() => borrar(solicitud.codigo)}
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