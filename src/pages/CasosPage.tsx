import { useEffect, useState } from "react";
import Title from "../components/atoms/Title";
import type { CasoLegal } from "../types/CasoLegal";
import {
  obtenerCasosActivos,
  obtenerCasosCompletos,
  crearCaso,
  editarCaso,
  eliminarCaso,
} from "../services/casoLegalService";

const inicial: CasoLegal = {
  codigo: "",
  tipoCaso: "",
  descripcion: "",
  fechaApertura: "",
  estadoCaso: "",
  prioridad: "",
};

export default function CasosPage() {
  const [casos, setCasos] = useState<CasoLegal[]>([]);
  const [form, setForm] = useState<CasoLegal>(inicial);
  const [editando, setEditando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [listaCompleta, setListaCompleta] = useState(false);

  const cargar = async () => {
    const data = listaCompleta
      ? await obtenerCasosCompletos()
      : await obtenerCasosActivos();

    setCasos(data);
  };

  useEffect(() => {
    cargar();
  }, [listaCompleta]);

  const cambiar = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const guardar = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...form,
      fechaApertura: form.fechaApertura.includes("T")
        ? form.fechaApertura
        : `${form.fechaApertura}T00:00:00Z`,
    };

    const res = editando
      ? await editarCaso(form.codigo, payload)
      : await crearCaso(payload);

    setMensaje(res);
    setForm(inicial);
    setEditando(false);
    cargar();
  };

  const seleccionarEditar = (caso: CasoLegal) => {
    setForm({
      ...caso,
      fechaApertura: caso.fechaApertura?.substring(0, 10),
    });
    setEditando(true);
  };

  const borrar = async (codigo: string) => {
    const confirmar = confirm("¿Seguro que deseas desactivar este caso?");
    if (!confirmar) return;

    const res = await eliminarCaso(codigo);
    setMensaje(res);
    cargar();
  };

  return (
    <section>
      <Title>Casos Legales</Title>

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
          name="tipoCaso"
          placeholder="Tipo de caso"
          value={form.tipoCaso}
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
          name="fechaApertura"
          value={form.fechaApertura}
          onChange={cambiar}
          required
        />

        <select name="estadoCaso" value={form.estadoCaso} onChange={cambiar} required>
          <option value="">Estado del caso</option>
          <option value="Abierto">Abierto</option>
          <option value="En Proceso">En Proceso</option>
          <option value="Cerrado">Cerrado</option>
        </select>

        <select name="prioridad" value={form.prioridad} onChange={cambiar} required>
          <option value="">Prioridad</option>
          <option value="Alta">Alta</option>
          <option value="Media">Media</option>
          <option value="Baja">Baja</option>
        </select>

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
            <th>Descripción</th>
            <th>Estado Caso</th>
            <th>Prioridad</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {casos.map((caso) => (
            <tr key={caso.codigo}>
              <td>{caso.codigo}</td>
              <td>{caso.tipoCaso}</td>
              <td>{caso.descripcion}</td>
              <td>{caso.estadoCaso}</td>
              <td>{caso.prioridad}</td>
              <td>
                <button className="mini-btn" onClick={() => seleccionarEditar(caso)}>
                  Editar
                </button>

                <button className="mini-btn danger" onClick={() => borrar(caso.codigo)}>
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