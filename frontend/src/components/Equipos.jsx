import { useEffect, useState } from "react";

function Equipos() {
    const [equipos, setEquipos] = useState([]);
    const [categorias, setCategorias] = useState([]);

    const [formulario, setFormulario] = useState({
        nombre: "",
        marca: "",
        modelo: "",
        numeroSerie: "",
        descripcion: "",
        precio: "",
        stock: "",
        estado: "Disponible",
        categoriaId: ""
    });

    const [editando, setEditando] = useState(null);
    const [mensaje, setMensaje] = useState("");

    // Búsqueda y ordenamiento
    const [busqueda, setBusqueda] = useState("");
    const [orden, setOrden] = useState("nombre");

    const obtenerEquipos = async () => {
        try {
            const respuesta = await fetch(
                "http://localhost:3000/api/equipos"
            );

            const datos = await respuesta.json();

            setEquipos(datos);
        } catch (error) {
            console.error("Error al obtener equipos:", error);
        }
    };

    const obtenerCategorias = async () => {
        try {
            const respuesta = await fetch(
                "http://localhost:3000/api/categorias"
            );

            const datos = await respuesta.json();

            setCategorias(datos);
        } catch (error) {
            console.error("Error al obtener categorías:", error);
        }
    };

    useEffect(() => {
        obtenerEquipos();
        obtenerCategorias();
    }, []);

    const manejarCambio = (e) => {
        const { name, value } = e.target;

        setFormulario({
            ...formulario,
            [name]: value
        });
    };

    const limpiarFormulario = () => {
        setFormulario({
            nombre: "",
            marca: "",
            modelo: "",
            numeroSerie: "",
            descripcion: "",
            precio: "",
            stock: "",
            estado: "Disponible",
            categoriaId: ""
        });

        setEditando(null);
    };

    const registrarEquipo = async (e) => {
        e.preventDefault();

        try {
            const respuesta = await fetch(
                "http://localhost:3000/api/equipos",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        ...formulario,
                        precio: Number(formulario.precio),
                        stock: Number(formulario.stock),
                        categoriaId: Number(formulario.categoriaId)
                    })
                }
            );

            const datos = await respuesta.json();

            if (!respuesta.ok) {
                setMensaje(datos.mensaje);
                return;
            }

            setMensaje("Equipo registrado correctamente.");

            limpiarFormulario();

            obtenerEquipos();
        } catch (error) {
            console.error(error);
            setMensaje("Error al conectar con el servidor.");
        }
    };

    const editarEquipo = (equipo) => {
        setEditando(equipo.id);

        setFormulario({
            nombre: equipo.nombre,
            marca: equipo.marca,
            modelo: equipo.modelo || "",
            numeroSerie: equipo.numeroSerie || "",
            descripcion: equipo.descripcion || "",
            precio: equipo.precio,
            stock: equipo.stock,
            estado: equipo.estado,
            categoriaId: equipo.categoriaId
        });

        setMensaje("");
    };

    const actualizarEquipo = async (e) => {
        e.preventDefault();

        try {
            const respuesta = await fetch(
                `http://localhost:3000/api/equipos/${editando}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        ...formulario,
                        precio: Number(formulario.precio),
                        stock: Number(formulario.stock),
                        categoriaId: Number(formulario.categoriaId)
                    })
                }
            );

            const datos = await respuesta.json();

            if (!respuesta.ok) {
                setMensaje(datos.mensaje);
                return;
            }

            setMensaje("Equipo actualizado correctamente.");

            limpiarFormulario();

            obtenerEquipos();
        } catch (error) {
            console.error(error);
            setMensaje("Error al conectar con el servidor.");
        }
    };

    const eliminarEquipo = async (id) => {
        const confirmar = window.confirm(
            "¿Está seguro de eliminar este equipo?"
        );

        if (!confirmar) {
            return;
        }

        try {
            const respuesta = await fetch(
                `http://localhost:3000/api/equipos/${id}`,
                {
                    method: "DELETE"
                }
            );

            const datos = await respuesta.json();

            if (!respuesta.ok) {
                setMensaje(datos.mensaje);
                return;
            }

            setMensaje("Equipo eliminado correctamente.");

            obtenerEquipos();
        } catch (error) {
            console.error(error);
            setMensaje("Error al conectar con el servidor.");
        }
    };

    // Equipos filtrados y ordenados
    const equiposFiltrados = equipos
        .filter((equipo) => {
            const texto = busqueda.toLowerCase();

            return (
                equipo.nombre.toLowerCase().includes(texto) ||
                equipo.marca.toLowerCase().includes(texto) ||
                (equipo.modelo &&
                    equipo.modelo.toLowerCase().includes(texto))
            );
        })
        .sort((a, b) => {
            if (orden === "nombre") {
                return a.nombre.localeCompare(b.nombre);
            }

            if (orden === "precio") {
                return Number(a.precio) - Number(b.precio);
            }

            if (orden === "stock") {
                return Number(a.stock) - Number(b.stock);
            }

            return 0;
        });

    // Equipos con stock bajo
    const equiposStockBajo = equipos.filter(
        (equipo) => Number(equipo.stock) <= 2
    );

    // Exportar inventario a TXT
    const exportarTXT = () => {
        if (equipos.length === 0) {
            setMensaje("No hay equipos para exportar.");
            return;
        }

        let contenido =
            "INVENTARIO DE EQUIPOS TECNOLÓGICOS\n";

        contenido +=
            "===================================\n\n";

        equipos.forEach((equipo) => {
            const categoria = categorias.find(
                (cat) => cat.id === equipo.categoriaId
            );

            contenido += `Equipo: ${equipo.nombre}\n`;
            contenido += `Marca: ${equipo.marca}\n`;
            contenido += `Modelo: ${
                equipo.modelo || "Sin modelo"
            }\n`;
            contenido += `Categoría: ${
                categoria
                    ? categoria.nombre
                    : "Sin categoría"
            }\n`;
            contenido += `Precio: Bs. ${equipo.precio}\n`;
            contenido += `Stock: ${equipo.stock}\n`;
            contenido += `Estado: ${equipo.estado}\n`;
            contenido += `Número de serie: ${
                equipo.numeroSerie || "Sin número de serie"
            }\n`;
            contenido += `Descripción: ${
                equipo.descripcion || "Sin descripción"
            }\n`;

            contenido +=
                "-----------------------------------\n\n";
        });

        const archivo = new Blob(
            [contenido],
            {
                type: "text/plain;charset=utf-8"
            }
        );

        const url = URL.createObjectURL(archivo);

        const enlace = document.createElement("a");

        enlace.href = url;
        enlace.download = "inventario_equipos.txt";

        enlace.click();

        URL.revokeObjectURL(url);

        setMensaje(
            "Inventario exportado correctamente."
        );
    };

    return (
        <div className="p-4">

            {/* ENCABEZADO */}

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>
                    <h2>Equipos</h2>

                    <p className="text-muted">
                        Gestión de equipos tecnológicos
                    </p>
                </div>

            </div>

            {/* ALERTA DE STOCK BAJO */}

            {equiposStockBajo.length > 0 && (
                <div className="alert alert-warning shadow-sm">

                    <h6 className="fw-bold">
                        <i className="bi bi-exclamation-triangle me-2"></i>
                        Alertas de stock bajo
                    </h6>

                    <ul className="mb-0">

                        {equiposStockBajo.map((equipo) => (
                            <li key={equipo.id}>
                                <strong>
                                    {equipo.nombre}
                                </strong>
                                : {equipo.stock} unidades disponibles.
                            </li>
                        ))}

                    </ul>

                </div>
            )}

            {/* FORMULARIO */}

            <div className="card shadow-sm border-0 mb-4">

                <div className="card-body">

                    <h5 className="mb-4">

                        {editando
                            ? "Editar equipo"
                            : "Registrar nuevo equipo"}

                    </h5>

                    <form
                        onSubmit={
                            editando
                                ? actualizarEquipo
                                : registrarEquipo
                        }
                    >

                        <div className="row g-3">

                            <div className="col-md-6">

                                <label className="form-label">
                                    Nombre
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    name="nombre"
                                    value={formulario.nombre}
                                    onChange={manejarCambio}
                                    required
                                />

                            </div>

                            <div className="col-md-6">

                                <label className="form-label">
                                    Marca
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    name="marca"
                                    value={formulario.marca}
                                    onChange={manejarCambio}
                                    required
                                />

                            </div>

                            <div className="col-md-4">

                                <label className="form-label">
                                    Modelo
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    name="modelo"
                                    value={formulario.modelo}
                                    onChange={manejarCambio}
                                />

                            </div>

                            <div className="col-md-4">

                                <label className="form-label">
                                    Número de serie
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    name="numeroSerie"
                                    value={formulario.numeroSerie}
                                    onChange={manejarCambio}
                                />

                            </div>

                            <div className="col-md-4">

                                <label className="form-label">
                                    Categoría
                                </label>

                                <select
                                    className="form-select"
                                    name="categoriaId"
                                    value={formulario.categoriaId}
                                    onChange={manejarCambio}
                                    required
                                >

                                    <option value="">
                                        Seleccione una categoría
                                    </option>

                                    {categorias.map((categoria) => (
                                        <option
                                            key={categoria.id}
                                            value={categoria.id}
                                        >
                                            {categoria.nombre}
                                        </option>
                                    ))}

                                </select>

                            </div>

                            <div className="col-md-4">

                                <label className="form-label">
                                    Precio
                                </label>

                                <input
                                    type="number"
                                    className="form-control"
                                    name="precio"
                                    value={formulario.precio}
                                    onChange={manejarCambio}
                                    min="0"
                                    step="0.01"
                                    required
                                />

                            </div>

                            <div className="col-md-4">

                                <label className="form-label">
                                    Stock
                                </label>

                                <input
                                    type="number"
                                    className="form-control"
                                    name="stock"
                                    value={formulario.stock}
                                    onChange={manejarCambio}
                                    min="0"
                                    required
                                />

                            </div>

                            <div className="col-md-4">

                                <label className="form-label">
                                    Estado
                                </label>

                                <select
                                    className="form-select"
                                    name="estado"
                                    value={formulario.estado}
                                    onChange={manejarCambio}
                                >

                                    <option value="Disponible">
                                        Disponible
                                    </option>

                                    <option value="No disponible">
                                        No disponible
                                    </option>

                                </select>

                            </div>

                            <div className="col-12">

                                <label className="form-label">
                                    Descripción
                                </label>

                                <textarea
                                    className="form-control"
                                    name="descripcion"
                                    value={formulario.descripcion}
                                    onChange={manejarCambio}
                                    rows="2"
                                ></textarea>

                            </div>

                        </div>

                        <div className="mt-4">

                            <button
                                type="submit"
                                className="btn btn-primary me-2"
                            >

                                <i className="bi bi-save me-2"></i>

                                {editando
                                    ? "Actualizar equipo"
                                    : "Registrar equipo"}

                            </button>

                            {editando && (

                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={limpiarFormulario}
                                >

                                    <i className="bi bi-x-circle me-2"></i>

                                    Cancelar

                                </button>

                            )}

                        </div>

                    </form>

                    {mensaje && (

                        <div className="alert alert-info mt-3 mb-0">

                            <i className="bi bi-info-circle me-2"></i>

                            {mensaje}

                        </div>

                    )}

                </div>

            </div>

            {/* TARJETAS DE EQUIPOS */}

            <div className="card shadow-sm border-0">

                <div className="card-body">

                    <div className="d-flex justify-content-between align-items-center mb-4">

                        <div>

                            <h5 className="mb-1">
                                Equipos registrados
                            </h5>

                            <p className="text-muted mb-0">
                                Equipos disponibles en el sistema
                            </p>

                        </div>

                        <div className="d-flex align-items-center gap-2">

                            <span className="badge bg-primary fs-6">
                                {equiposFiltrados.length} equipos
                            </span>

                            <button
                                className="btn btn-outline-primary"
                                onClick={exportarTXT}
                            >
                                <i className="bi bi-file-earmark-text me-2"></i>
                                Exportar TXT
                            </button>

                        </div>

                    </div>

                    {/* BÚSQUEDA Y ORDEN */}

                    <div className="row g-2 mb-4">

                        <div className="col-md-8">

                            <div className="input-group">

                                <span className="input-group-text">
                                    <i className="bi bi-search"></i>
                                </span>

                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Buscar por nombre, marca o modelo..."
                                    value={busqueda}
                                    onChange={(e) =>
                                        setBusqueda(e.target.value)
                                    }
                                />

                            </div>

                        </div>

                        <div className="col-md-4">

                            <select
                                className="form-select"
                                value={orden}
                                onChange={(e) =>
                                    setOrden(e.target.value)
                                }
                            >

                                <option value="nombre">
                                    Ordenar por nombre
                                </option>

                                <option value="precio">
                                    Ordenar por precio
                                </option>

                                <option value="stock">
                                    Ordenar por stock
                                </option>

                            </select>

                        </div>

                    </div>

                    {/* LISTADO */}

                    {equipos.length === 0 ? (

                        <div className="text-center py-5">

                            <div style={{ fontSize: "50px" }}>
                                💻
                            </div>

                            <h5 className="mt-3">
                                No existen equipos registrados
                            </h5>

                            <p className="text-muted">
                                Registra un equipo utilizando el formulario superior.
                            </p>

                        </div>

                    ) : equiposFiltrados.length === 0 ? (

                        <div className="text-center py-5">

                            <div style={{ fontSize: "50px" }}>
                                🔎
                            </div>

                            <h5 className="mt-3">
                                No se encontraron equipos
                            </h5>

                            <p className="text-muted">
                                Intenta con otro nombre, marca o modelo.
                            </p>

                        </div>

                    ) : (

                        <div className="row g-4">

                            {equiposFiltrados.map((equipo) => {

                                const categoria = categorias.find(
                                    (cat) =>
                                        cat.id === equipo.categoriaId
                                );

                                return (

                                    <div
                                        className="col-md-6 col-lg-4"
                                        key={equipo.id}
                                    >

                                        <div className="card h-100 border shadow-sm">

                                            <div
                                                className="d-flex align-items-center justify-content-center bg-light"
                                                style={{
                                                    height: "150px",
                                                    fontSize: "70px"
                                                }}
                                            >

                                                {categoria?.nombre === "Computadoras" && (
                                                    <i className="bi bi-laptop"></i>
                                                )}

                                                {categoria?.nombre === "Monitores" && (
                                                    <i className="bi bi-display"></i>
                                                )}

                                                {categoria?.nombre === "Impresoras" && (
                                                    <i className="bi bi-printer"></i>
                                                )}

                                                {categoria?.nombre === "Periféricos" && (
                                                    <i className="bi bi-keyboard"></i>
                                                )}

                                                {categoria?.nombre === "Redes" && (
                                                    <i className="bi bi-router"></i>
                                                )}

                                                {![
                                                    "Computadoras",
                                                    "Monitores",
                                                    "Impresoras",
                                                    "Periféricos",
                                                    "Redes"
                                                ].includes(categoria?.nombre) && (
                                                    <i className="bi bi-pc-display"></i>
                                                )}

                                            </div>

                                            <div className="card-body">

                                                <div className="d-flex justify-content-between align-items-start mb-2">

                                                    <h5 className="card-title fw-bold mb-0">
                                                        {equipo.nombre}
                                                    </h5>

                                                    <span
                                                        className={`badge ${
                                                            equipo.estado ===
                                                            "Disponible"
                                                                ? "bg-success"
                                                                : "bg-secondary"
                                                        }`}
                                                    >
                                                        {equipo.estado}
                                                    </span>

                                                </div>

                                                <p className="text-muted mb-2">

                                                    {equipo.marca}

                                                    {equipo.modelo
                                                        ? ` · ${equipo.modelo}`
                                                        : ""}

                                                </p>

                                                <p className="mb-2">

                                                    <strong>
                                                        Categoría:
                                                    </strong>{" "}

                                                    {categoria
                                                        ? categoria.nombre
                                                        : "Sin categoría"}

                                                </p>

                                                <p className="mb-2">

                                                    <strong>
                                                        Precio:
                                                    </strong>{" "}

                                                    Bs. {equipo.precio}

                                                </p>

                                                <p className="mb-2">

                                                    <strong>
                                                        Stock:
                                                    </strong>{" "}

                                                    {equipo.stock} unidades

                                                    {Number(equipo.stock) <= 2 && (
                                                        <span className="badge bg-danger ms-2">
                                                            Stock bajo
                                                        </span>
                                                    )}

                                                </p>

                                                {equipo.numeroSerie && (

                                                    <p className="mb-2">

                                                        <strong>
                                                            N.º Serie:
                                                        </strong>{" "}

                                                        {equipo.numeroSerie}

                                                    </p>

                                                )}

                                                {equipo.descripcion && (

                                                    <p className="text-muted small mb-3">
                                                        {equipo.descripcion}
                                                    </p>

                                                )}

                                            </div>

                                            <div className="card-footer bg-white border-0">

                                                <button
                                                    className="btn btn-warning btn-sm me-2"
                                                    onClick={() =>
                                                        editarEquipo(equipo)
                                                    }
                                                >
                                                    <i className="bi bi-pencil me-1"></i>
                                                    Editar
                                                </button>

                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() =>
                                                        eliminarEquipo(
                                                            equipo.id
                                                        )
                                                    }
                                                >
                                                    <i className="bi bi-trash me-1"></i>
                                                    Eliminar
                                                </button>

                                            </div>

                                        </div>

                                    </div>

                                );

                            })}

                        </div>

                    )}

                </div>

            </div>

        </div>
    );
}

export default Equipos;