import { useEffect, useState } from "react";
import Title from "../components/atoms/Title";
import type { Consentimiento } from "../types/Consentimiento";
import {
  obtenerConsentimientosActivos,
  obtenerConsentimientosCompletos,
  crearConsentimiento,
  editarConsentimiento,
  eliminarConsentimiento,
} from "../services/consentimientoService";

const inicial: Consentimiento = {
  codigo: "",
  tipoTratamiento: "",
  descripcion: "",
  fecha: "",
  firmado: false,
  nombreFirmante: "",
  parentescoFirmante: "",
};

export default function ConsentimientosPage() {
  const [consentimientos, setConsentimientos] = useState<Consentimiento[]>([]);
  const [form, setForm] = useState<Consentimiento>(inicial);
  const [editando, setEditando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [listaCompleta, setListaCompleta] = useState(false);

  const cargar = async () => {
    const data = listaCompleta
      ? await obtenerConsentimientosCompletos()
      : await obtenerConsentimientosActivos();

    setConsentimientos(data);
  };

  useEffect(() => {
    cargar();
  }, [listaCompleta]);

  const cambiar = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: name === "firmado" ? value === "true" : value,
    });
  };

  const guardar = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...form,
      fecha: form.fecha.includes("T") ? form.fecha : `${form.fecha}T00:00:00Z`,
    };

    const res = editando
      ? await editarConsentimiento(form.codigo, payload)
      : await crearConsentimiento(payload);

    setMensaje(res);
    setForm(inicial);
    setEditando(false);
    cargar();
  };

  const seleccionarEditar = (consentimiento: Consentimiento) => {
    setForm({
      ...consentimiento,
      fecha: consentimiento.fecha?.substring(0, 10),
    });
    setEditando(true);
  };

  const borrar = async (codigo: string) => {
    const confirmar = confirm("¿Seguro que deseas desactivar este consentimiento?");
    if (!confirmar) return;

    const res = await eliminarConsentimiento(codigo);
    setMensaje(res);
    cargar();
  };

  return (
    <section>
      <Title>Consentimientos</Title>

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
          name="tipoTratamiento"
          value={form.tipoTratamiento}
          onChange={cambiar}
          required
        >
          <option value="">Tipo de tratamiento</option>
          <option value="Cirugía">Cirugía</option>
          <option value="Tratamiento médico">Tratamiento médico</option>
          <option value="Terapia">Terapia</option>
          <option value="Procedimiento invasivo">Procedimiento invasivo</option>
        </select>

        <input
          name="descripcion"
          placeholder="Descripción"
          value={form.descripcion}
          onChange={cambiar}
          required
        />

        <input
          type="date"
          name="fecha"
          value={form.fecha}
          onChange={cambiar}
          required
        />

        <select name="firmado" value={String(form.firmado)} onChange={cambiar}>
          <option value="false">Pendiente</option>
          <option value="true">Firmado</option>
        </select>

        <input
          name="nombreFirmante"
          placeholder="Nombre firmante"
          value={form.nombreFirmante}
          onChange={cambiar}
          required
        />

        <input
          name="parentescoFirmante"
          placeholder="Parentesco"
          value={form.parentescoFirmante}
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
            <th>Tratamiento</th>
            <th>Fecha</th>
            <th>Firmado</th>
            <th>Firmante</th>
            <th>Parentesco</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {consentimientos.map((cons) => (
            <tr key={cons.codigo}>
              <td>{cons.codigo}</td>
              <td>{cons.tipoTratamiento}</td>
              <td>{new Date(cons.fecha).toLocaleDateString()}</td>
              <td>
                <span className={cons.firmado ? "badge success" : "badge danger"}>
                  {cons.firmado ? "Firmado" : "Pendiente"}
                </span>
              </td>
              <td>{cons.nombreFirmante}</td>
              <td>{cons.parentescoFirmante}</td>
              <td>
                <button className="mini-btn" onClick={() => seleccionarEditar(cons)}>
                  Editar
                </button>

                <button className="mini-btn danger" onClick={() => borrar(cons.codigo)}>
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