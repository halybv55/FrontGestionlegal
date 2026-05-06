import { useEffect, useState } from "react";
import Title from "../components/atoms/Title";
import type { Regla } from "../types/Regla";
import {
  obtenerReglasActivas,
  obtenerReglasCompletas,
  crearRegla,
  editarRegla,
  eliminarRegla,
} from "../services/reglaService";

const inicial: Regla = {
  codigo: "",
  titulo: "",
  descripcion: "",
  tipoRegla: "",
  fechaCreacion: "",
};

export default function ReglasPage() {
  const [reglas, setReglas] = useState<Regla[]>([]);
  const [form, setForm] = useState<Regla>(inicial);
  const [editando, setEditando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [listaCompleta, setListaCompleta] = useState(false);

  const cargar = async () => {
    const data = listaCompleta
      ? await obtenerReglasCompletas()
      : await obtenerReglasActivas();

    setReglas(data);
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
      fechaCreacion: form.fechaCreacion.includes("T")
        ? form.fechaCreacion
        : `${form.fechaCreacion}T00:00:00Z`,
    };

    const res = editando
      ? await editarRegla(form.codigo, payload)
      : await crearRegla(payload);

    setMensaje(res);
    setForm(inicial);
    setEditando(false);
    cargar();
  };

  const seleccionarEditar = (regla: Regla) => {
    setForm({
      ...regla,
      fechaCreacion: regla.fechaCreacion?.substring(0, 10),
    });
    setEditando(true);
  };

  const borrar = async (codigo: string) => {
    const confirmar = confirm("¿Seguro que deseas desactivar esta regla?");
    if (!confirmar) return;

    const res = await eliminarRegla(codigo);
    setMensaje(res);
    cargar();
  };

  return (
    <section>
      <Title>Reglas Legales</Title>

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

        <input
          name="titulo"
          placeholder="Título"
          value={form.titulo}
          onChange={cambiar}
          required
        />

        <select
          name="tipoRegla"
          value={form.tipoRegla}
          onChange={cambiar}
          required
        >
          <option value="">Tipo de regla</option>
          <option value="Consentimiento">Consentimiento</option>
          <option value="Documentación">Documentación</option>
          <option value="Solicitud">Solicitud</option>
          <option value="Caso Legal">Caso Legal</option>
          <option value="Administrativa">Administrativa</option>
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
          name="fechaCreacion"
          value={form.fechaCreacion}
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

      <div className="cards">
        {reglas.map((regla) => (
          <div className="card" key={regla.codigo}>
            <span className="badge">{regla.tipoRegla}</span>
            <h3>{regla.titulo}</h3>
            <p>{regla.descripcion}</p>
            <small>{new Date(regla.fechaCreacion).toLocaleDateString()}</small>

            <div className="card-actions">
              <button className="mini-btn" onClick={() => seleccionarEditar(regla)}>
                Editar
              </button>

              <button className="mini-btn danger" onClick={() => borrar(regla.codigo)}>
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}