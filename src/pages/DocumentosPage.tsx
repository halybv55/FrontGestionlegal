import { useEffect, useState } from "react";
import Title from "../components/atoms/Title";
import type { DocumentoLegal } from "../types/DocumentoLegal";
import {
  obtenerDocumentosActivos,
  obtenerDocumentosCompletos,
  crearDocumento,
  editarDocumento,
  eliminarDocumento,
} from "../services/documentoLegalService";

const inicial: DocumentoLegal = {
  codigo: "",
  titulo: "",
  tipo: "",
  descripcion: "",
  fechaEmision: "",
  formato: "",
  archivoUrl: "",
};

export default function DocumentosPage() {
  const [documentos, setDocumentos] = useState<DocumentoLegal[]>([]);
  const [form, setForm] = useState<DocumentoLegal>(inicial);
  const [editando, setEditando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [listaCompleta, setListaCompleta] = useState(false);

  const cargar = async () => {
    const data = listaCompleta
      ? await obtenerDocumentosCompletos()
      : await obtenerDocumentosActivos();

    setDocumentos(data);
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
      fechaEmision: form.fechaEmision.includes("T")
        ? form.fechaEmision
        : `${form.fechaEmision}T00:00:00Z`,
    };

    const res = editando
      ? await editarDocumento(form.codigo, payload)
      : await crearDocumento(payload);

    setMensaje(res);
    setForm(inicial);
    setEditando(false);
    cargar();
  };

  const seleccionarEditar = (doc: DocumentoLegal) => {
    setForm({
      ...doc,
      fechaEmision: doc.fechaEmision?.substring(0, 10),
    });
    setEditando(true);
  };

  const borrar = async (codigo: string) => {
    const confirmar = confirm("¿Seguro que deseas desactivar este documento?");
    if (!confirmar) return;

    const res = await eliminarDocumento(codigo);
    setMensaje(res);
    cargar();
  };

  return (
    <section>
      <Title>Documentos Legales</Title>

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

        <select name="tipo" value={form.tipo} onChange={cambiar} required>
          <option value="">Tipo de documento</option>
          <option value="Informe">Informe</option>
          <option value="Certificado">Certificado</option>
          <option value="Consentimiento">Consentimiento</option>
          <option value="Contrato">Contrato</option>
          <option value="Resolución">Resolución</option>
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
          name="fechaEmision"
          value={form.fechaEmision}
          onChange={cambiar}
          required
        />

        <select name="formato" value={form.formato} onChange={cambiar} required>
          <option value="">Formato</option>
          <option value="PDF">PDF</option>
          <option value="DOCX">DOCX</option>
          <option value="Imagen">Imagen</option>
        </select>

        <input
          name="archivoUrl"
          placeholder="URL del archivo"
          value={form.archivoUrl}
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
            <th>Título</th>
            <th>Tipo</th>
            <th>Formato</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {documentos.map((doc) => (
            <tr key={doc.codigo}>
              <td>{doc.codigo}</td>
              <td>{doc.titulo}</td>
              <td>{doc.tipo}</td>
              <td>{doc.formato}</td>
              <td>{new Date(doc.fechaEmision).toLocaleDateString()}</td>
              <td>
                <button className="mini-btn" onClick={() => seleccionarEditar(doc)}>
                  Editar
                </button>

                <button className="mini-btn danger" onClick={() => borrar(doc.codigo)}>
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