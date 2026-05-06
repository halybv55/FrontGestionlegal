import { useEffect, useState } from "react";
import Title from "../components/atoms/Title";
import type { CasoInvolucrado } from "../types/CasoInvolucrado";
import {
  obtenerCasoInvolucradosActivos,
  obtenerCasoInvolucradosCompletos,
  crearCasoInvolucrado,
  editarCasoInvolucrado,
  eliminarCasoInvolucrado,
} from "../services/casoInvolucradoService";

const inicial: CasoInvolucrado = {
  codigo: "",
  codigoCasoLegal: "",
  rolInvolucrado: "",
  descripcionParticipacion: "",
};

export default function CasoInvolucradosPage() {
  const [involucrados, setInvolucrados] = useState<CasoInvolucrado[]>([]);
  const [form, setForm] = useState<CasoInvolucrado>(inicial);
  const [editando, setEditando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [listaCompleta, setListaCompleta] = useState(false);

  const cargar = async () => {
    const data = listaCompleta
      ? await obtenerCasoInvolucradosCompletos()
      : await obtenerCasoInvolucradosActivos();

    setInvolucrados(data);
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

    const res = editando
      ? await editarCasoInvolucrado(form.codigo, form)
      : await crearCasoInvolucrado(form);

    setMensaje(res);
    setForm(inicial);
    setEditando(false);
    cargar();
  };

  const seleccionarEditar = (involucrado: CasoInvolucrado) => {
    setForm(involucrado);
    setEditando(true);
  };

  const borrar = async (codigo: string) => {
    const confirmar = confirm("¿Seguro que deseas desactivar este involucrado?");
    if (!confirmar) return;

    const res = await eliminarCasoInvolucrado(codigo);
    setMensaje(res);
    cargar();
  };

  return (
    <section>
      <Title>Involucrados en Casos Legales</Title>

      <p className="subtitle">
        Registra participantes o roles involucrados dentro de un caso legal.
      </p>

      {mensaje && <p className="message">{mensaje}</p>}

      <form className="form-card" onSubmit={guardar}>
        <input
          name="codigo"
          placeholder="Código involucrado"
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

        <select
          name="rolInvolucrado"
          value={form.rolInvolucrado}
          onChange={cambiar}
          required
        >
          <option value="">Rol involucrado</option>
          <option value="Demandante">Demandante</option>
          <option value="Demandado">Demandado</option>
          <option value="Testigo">Testigo</option>
          <option value="Responsable legal">Responsable legal</option>
          <option value="Médico involucrado">Médico involucrado</option>
          <option value="Paciente involucrado">Paciente involucrado</option>
        </select>

        <input
          name="descripcionParticipacion"
          placeholder="Descripción de participación"
          value={form.descripcionParticipacion}
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
            <th>Rol</th>
            <th>Participación</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {involucrados.map((item) => (
            <tr key={item.codigo}>
              <td>{item.codigo}</td>
              <td>{item.codigoCasoLegal}</td>
              <td>{item.rolInvolucrado}</td>
              <td>{item.descripcionParticipacion}</td>
              <td>
                <button
                  className="mini-btn"
                  onClick={() => seleccionarEditar(item)}
                >
                  Editar
                </button>

                <button
                  className="mini-btn danger"
                  onClick={() => borrar(item.codigo)}
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