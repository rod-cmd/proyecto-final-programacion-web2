import { useEffect, useState } from "react";

function Categorias() {

    const [categorias, setCategorias] = useState([]);

    const [formulario, setFormulario] = useState({
        nombre: "",
        descripcion: "",
        estado: true
    });

    const [editando, setEditando] = useState(null);

    const [mensaje, setMensaje] = useState("");
    const [tipoMensaje, setTipoMensaje] = useState("info");

    // Búsqueda y ordenamiento
    const [busqueda, setBusqueda] = useState("");
    const [orden, setOrden] = useState("nombre");


    // ==============================
    // OBTENER CATEGORÍAS
    // ==============================

    const obtenerCategorias = async () => {

        try {

            const respuesta = await fetch(
                "http://localhost:3000/api/categorias"
            );

            const datos = await respuesta.json();

            if (!respuesta.ok) {

                mostrarMensaje(
                    datos.mensaje ||
                    "No se pudieron obtener las categorías.",
                    "danger"
                );

                return;
            }

            setCategorias(datos);

        } catch (error) {

            console.error(
                "Error al obtener categorías:",
                error
            );

            mostrarMensaje(
                "Error al conectar con el servidor.",
                "danger"
            );
        }
    };


    useEffect(() => {

        obtenerCategorias();

    }, []);


    // ==============================
    // MOSTRAR MENSAJE
    // ==============================

    const mostrarMensaje = (texto, tipo = "info") => {

        setMensaje(texto);
        setTipoMensaje(tipo);

        setTimeout(() => {

            setMensaje("");

        }, 3000);
    };


    // ==============================
    // CAMBIAR CAMPOS
    // ==============================

    const manejarCambio = (e) => {

        const { name, value } = e.target;

        setFormulario({
            ...formulario,
            [name]: value
        });
    };


    // ==============================
    // LIMPIAR FORMULARIO
    // ==============================

    const limpiarFormulario = () => {

        setFormulario({
            nombre: "",
            descripcion: "",
            estado: true
        });

        setEditando(null);
    };


    // ==============================
    // REGISTRAR / ACTUALIZAR
    // ==============================

    const guardarCategoria = async (e) => {

        e.preventDefault();

        const nombre = formulario.nombre.trim();

        if (!nombre) {

            mostrarMensaje(
                "Complete correctamente el nombre de la categoría.",
                "warning"
            );

            return;
        }


        try {

            const url = editando
                ? `http://localhost:3000/api/categorias/${editando}`
                : "http://localhost:3000/api/categorias";


            const metodo = editando
                ? "PUT"
                : "POST";


            const respuesta = await fetch(url, {

                method: metodo,

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    ...formulario,

                    nombre: nombre,

                    estado:
                        formulario.estado === true ||
                        formulario.estado === "true"

                })

            });


            const datos = await respuesta.json();


            if (!respuesta.ok) {

                mostrarMensaje(
                    datos.mensaje ||
                    "No se pudo guardar la categoría.",
                    "danger"
                );

                return;
            }


            mostrarMensaje(

                editando
                    ? "Categoría actualizada correctamente."
                    : "Categoría registrada correctamente.",

                "success"

            );


            limpiarFormulario();

            obtenerCategorias();


        } catch (error) {

            console.error(error);

            mostrarMensaje(
                "Error al conectar con el servidor.",
                "danger"
            );
        }
    };


    // ==============================
    // EDITAR
    // ==============================

    const editarCategoria = (categoria) => {

        setEditando(categoria.id);

        setFormulario({

            nombre: categoria.nombre,

            descripcion:
                categoria.descripcion || "",

            estado:
                categoria.estado

        });

        setMensaje("");
    };


    // ==============================
    // ELIMINAR
    // ==============================

    const eliminarCategoria = async (id) => {

        const confirmar = window.confirm(
            "¿Está seguro de eliminar esta categoría?"
        );


        if (!confirmar) {
            return;
        }


        try {

            const respuesta = await fetch(

                `http://localhost:3000/api/categorias/${id}`,

                {
                    method: "DELETE"
                }

            );


            const datos = await respuesta.json();


            if (!respuesta.ok) {

                mostrarMensaje(
                    datos.mensaje ||
                    "No se pudo eliminar la categoría.",
                    "danger"
                );

                return;
            }


            mostrarMensaje(
                "Categoría eliminada correctamente.",
                "success"
            );


            if (editando === id) {

                limpiarFormulario();

            }


            obtenerCategorias();


        } catch (error) {

            console.error(error);

            mostrarMensaje(
                "Error al conectar con el servidor.",
                "danger"
            );
        }
    };


    // ==============================
    // ÍCONO DE CATEGORÍA
    // ==============================

    const obtenerIcono = (nombre) => {

        switch (nombre.toLowerCase()) {

            case "computadoras":
                return "bi bi-laptop";

            case "monitores":
                return "bi bi-display";

            case "impresoras":
                return "bi bi-printer";

            case "periféricos":
            case "perifericos":
                return "bi bi-keyboard";

            case "redes":
                return "bi bi-router";

            case "servidores":
                return "bi bi-server";

            case "celulares":
                return "bi bi-phone";

            case "tablets":
                return "bi bi-tablet";

            case "almacenamiento":
                return "bi bi-device-hdd";

            case "accesorios":
                return "bi bi-usb-drive";

            default:
                return "bi bi-folder";
        }
    };


    // ==============================
    // CATEGORÍAS FILTRADAS
    // ==============================

    const categoriasFiltradas = categorias

        .filter((categoria) => {

            const texto = busqueda.toLowerCase();

            return (

                categoria.nombre
                    .toLowerCase()
                    .includes(texto)

                ||

                (categoria.descripcion &&
                    categoria.descripcion
                        .toLowerCase()
                        .includes(texto))

            );
        })


        .sort((a, b) => {

            if (orden === "nombre") {

                return a.nombre.localeCompare(
                    b.nombre
                );
            }


            if (orden === "estado") {

                return Number(b.estado) -
                    Number(a.estado);
            }


            if (orden === "id") {

                return a.id - b.id;
            }


            return 0;
        });


    // ==============================
    // CONTADORES
    // ==============================

    const categoriasActivas = categorias.filter(
        (categoria) => categoria.estado
    );


    const categoriasInactivas = categorias.filter(
        (categoria) => !categoria.estado
    );


    // ==============================
    // EXPORTAR TXT
    // ==============================

    const exportarTXT = () => {

        if (categorias.length === 0) {

            mostrarMensaje(
                "No hay categorías para exportar.",
                "warning"
            );

            return;
        }


        let contenido =
            "CATEGORÍAS DE EQUIPOS TECNOLÓGICOS\n";


        contenido +=
            "===================================\n\n";


        categorias.forEach((categoria) => {

            contenido +=
                `ID: ${categoria.id}\n`;

            contenido +=
                `Nombre: ${categoria.nombre}\n`;

            contenido +=
                `Descripción: ${
                    categoria.descripcion ||
                    "Sin descripción"
                }\n`;

            contenido +=
                `Estado: ${
                    categoria.estado
                        ? "Activa"
                        : "Inactiva"
                }\n`;

            contenido +=
                "-----------------------------------\n\n";
        });


        const archivo = new Blob(

            [contenido],

            {
                type:
                    "text/plain;charset=utf-8"
            }

        );


        const url =
            URL.createObjectURL(archivo);


        const enlace =
            document.createElement("a");


        enlace.href = url;

        enlace.download =
            "categorias_equipos.txt";


        enlace.click();


        URL.revokeObjectURL(url);


        mostrarMensaje(
            "Categorías exportadas correctamente.",
            "success"
        );
    };


    return (

        <div className="p-4">


            {/* ==============================
                ENCABEZADO
            ============================== */}

            <div className="mb-4">

                <h2>
                    Categorías
                </h2>

                <p className="text-muted">
                    Gestión de categorías de equipos tecnológicos
                </p>

            </div>


            {/* ==============================
                RESUMEN
            ============================== */}

            <div className="row g-3 mb-4">


                {/* TOTAL */}

                <div className="col-md-4">

                    <div className="card shadow-sm border-0 h-100">

                        <div className="card-body">

                            <div className="d-flex justify-content-between align-items-center">

                                <div>

                                    <p className="text-muted mb-1">
                                        Total de categorías
                                    </p>

                                    <h3 className="fw-bold mb-0">
                                        {categorias.length}
                                    </h3>

                                </div>

                                <div
                                    className="fs-1 text-primary"
                                >
                                    <i className="bi bi-folder"></i>
                                </div>

                            </div>

                        </div>

                    </div>

                </div>


                {/* ACTIVAS */}

                <div className="col-md-4">

                    <div className="card shadow-sm border-0 h-100">

                        <div className="card-body">

                            <div className="d-flex justify-content-between align-items-center">

                                <div>

                                    <p className="text-muted mb-1">
                                        Categorías activas
                                    </p>

                                    <h3 className="fw-bold mb-0 text-success">
                                        {categoriasActivas.length}
                                    </h3>

                                </div>

                                <div className="fs-1 text-success">

                                    <i className="bi bi-check-circle"></i>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>


                {/* INACTIVAS */}

                <div className="col-md-4">

                    <div className="card shadow-sm border-0 h-100">

                        <div className="card-body">

                            <div className="d-flex justify-content-between align-items-center">

                                <div>

                                    <p className="text-muted mb-1">
                                        Categorías inactivas
                                    </p>

                                    <h3 className="fw-bold mb-0 text-secondary">
                                        {categoriasInactivas.length}
                                    </h3>

                                </div>

                                <div className="fs-1 text-secondary">

                                    <i className="bi bi-dash-circle"></i>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>


            {/* ==============================
                ALERTA
            ============================== */}

            {categoriasInactivas.length > 0 && (

                <div className="alert alert-warning shadow-sm">

                    <h6 className="fw-bold">

                        <i className="bi bi-exclamation-triangle me-2"></i>

                        Categorías inactivas

                    </h6>

                    <p className="mb-0">

                        Actualmente existen{" "}
                        <strong>
                            {categoriasInactivas.length}
                        </strong>{" "}
                        categorías marcadas como inactivas.

                    </p>

                </div>

            )}


            {/* ==============================
                FORMULARIO
            ============================== */}

            <div className="card shadow-sm border-0 mb-4">

                <div className="card-body">

                    <h5 className="mb-4">

                        {editando
                            ? "Editar categoría"
                            : "Registrar nueva categoría"}

                    </h5>


                    <form onSubmit={guardarCategoria}>

                        <div className="row g-3">


                            {/* NOMBRE */}

                            <div className="col-md-5">

                                <label className="form-label">

                                    Nombre

                                </label>

                                <input

                                    type="text"

                                    className="form-control"

                                    name="nombre"

                                    placeholder="Ej. Computadoras"

                                    value={
                                        formulario.nombre
                                    }

                                    onChange={
                                        manejarCambio
                                    }

                                    required

                                />

                            </div>


                            {/* DESCRIPCIÓN */}

                            <div className="col-md-5">

                                <label className="form-label">

                                    Descripción

                                </label>

                                <input

                                    type="text"

                                    className="form-control"

                                    name="descripcion"

                                    placeholder="Descripción de la categoría"

                                    value={
                                        formulario.descripcion
                                    }

                                    onChange={
                                        manejarCambio
                                    }

                                />

                            </div>


                            {/* ESTADO */}

                            <div className="col-md-2">

                                <label className="form-label">

                                    Estado

                                </label>

                                <select

                                    className="form-select"

                                    name="estado"

                                    value={
                                        formulario.estado.toString()
                                    }

                                    onChange={
                                        manejarCambio
                                    }

                                >

                                    <option value="true">
                                        Activa
                                    </option>

                                    <option value="false">
                                        Inactiva
                                    </option>

                                </select>

                            </div>

                        </div>


                        {/* BOTONES */}

                        <div className="mt-4">

                            <button

                                type="submit"

                                className="btn btn-primary me-2"

                            >

                                <i className="bi bi-save me-2"></i>

                                {editando
                                    ? "Actualizar categoría"
                                    : "Registrar categoría"}

                            </button>


                            {editando && (

                                <button

                                    type="button"

                                    className="btn btn-secondary"

                                    onClick={
                                        limpiarFormulario
                                    }

                                >

                                    <i className="bi bi-x-circle me-2"></i>

                                    Cancelar

                                </button>

                            )}

                        </div>

                    </form>


                    {/* MENSAJE */}

                    {mensaje && (

                        <div
                            className={`alert alert-${tipoMensaje} mt-3 mb-0`}
                        >

                            <i className="bi bi-info-circle me-2"></i>

                            {mensaje}

                        </div>

                    )}

                </div>

            </div>


            {/* ==============================
                LISTADO
            ============================== */}

            <div className="card shadow-sm border-0">

                <div className="card-body">


                    {/* CABECERA */}

                    <div className="d-flex justify-content-between align-items-center mb-4">

                        <div>

                            <h5 className="mb-1">
                                Categorías registradas
                            </h5>

                            <p className="text-muted mb-0">
                                Categorías disponibles para los equipos
                            </p>

                        </div>


                        <div className="d-flex align-items-center gap-2">

                            <span className="badge bg-primary fs-6">

                                {categoriasFiltradas.length}

                                {" "}

                                {categoriasFiltradas.length === 1
                                    ? "categoría"
                                    : "categorías"}

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


                    {/* ==============================
                        BÚSQUEDA Y ORDEN
                    ============================== */}

                    <div className="row g-2 mb-4">


                        {/* BÚSQUEDA */}

                        <div className="col-md-8">

                            <div className="input-group">

                                <span className="input-group-text">

                                    <i className="bi bi-search"></i>

                                </span>


                                <input

                                    type="text"

                                    className="form-control"

                                    placeholder="Buscar por nombre o descripción..."

                                    value={busqueda}

                                    onChange={(e) =>
                                        setBusqueda(
                                            e.target.value
                                        )
                                    }

                                />

                            </div>

                        </div>


                        {/* ORDEN */}

                        <div className="col-md-4">

                            <select

                                className="form-select"

                                value={orden}

                                onChange={(e) =>
                                    setOrden(
                                        e.target.value
                                    )
                                }

                            >

                                <option value="nombre">
                                    Ordenar por nombre
                                </option>

                                <option value="estado">
                                    Ordenar por estado
                                </option>

                                <option value="id">
                                    Ordenar por ID
                                </option>

                            </select>

                        </div>

                    </div>


                    {/* ==============================
                        LISTADO VACÍO
                    ============================== */}

                    {categorias.length === 0 ? (

                        <div className="text-center py-5">

                            <div
                                style={{
                                    fontSize: "60px"
                                }}
                            >

                                <i className="bi bi-folder2-open"></i>

                            </div>


                            <h5 className="mt-3">

                                No existen categorías registradas

                            </h5>


                            <p className="text-muted">

                                Registra una categoría utilizando
                                el formulario superior.

                            </p>

                        </div>


                    ) : categoriasFiltradas.length === 0 ? (

                        <div className="text-center py-5">

                            <div
                                style={{
                                    fontSize: "60px"
                                }}
                            >

                                🔎

                            </div>


                            <h5 className="mt-3">

                                No se encontraron categorías

                            </h5>


                            <p className="text-muted">

                                Intenta con otro nombre
                                o descripción.

                            </p>

                        </div>


                    ) : (


                        /* ==============================
                           TARJETAS
                        ============================== */

                        <div className="row g-4">

                            {categoriasFiltradas.map(
                                (categoria) => (

                                    <div

                                        className="col-md-6 col-lg-4"

                                        key={categoria.id}

                                    >

                                        <div className="card h-100 border shadow-sm">


                                            {/* ICONO */}

                                            <div

                                                className="d-flex align-items-center justify-content-center bg-light"

                                                style={{
                                                    height: "150px",
                                                    fontSize: "70px"
                                                }}

                                            >

                                                <i
                                                    className={
                                                        obtenerIcono(
                                                            categoria.nombre
                                                        )
                                                    }
                                                ></i>

                                            </div>


                                            {/* INFORMACIÓN */}

                                            <div className="card-body">


                                                <div className="d-flex justify-content-between align-items-start mb-3">

                                                    <h5 className="card-title fw-bold mb-0">

                                                        {categoria.nombre}

                                                    </h5>


                                                    {categoria.estado ? (

                                                        <span className="badge bg-success">

                                                            Activa

                                                        </span>

                                                    ) : (

                                                        <span className="badge bg-secondary">

                                                            Inactiva

                                                        </span>

                                                    )}

                                                </div>


                                                <p className="text-muted">

                                                    {categoria.descripcion ||
                                                        "Sin descripción"}

                                                </p>


                                                <p className="small text-muted mb-0">

                                                    <i className="bi bi-hash"></i>

                                                    ID de categoría:
                                                    {" "}
                                                    {categoria.id}

                                                </p>

                                            </div>


                                            {/* BOTONES */}

                                            <div className="card-footer bg-white border-0">


                                                <button

                                                    className="btn btn-warning btn-sm me-2"

                                                    onClick={() =>
                                                        editarCategoria(
                                                            categoria
                                                        )
                                                    }

                                                >

                                                    <i className="bi bi-pencil me-1"></i>

                                                    Editar

                                                </button>


                                                <button

                                                    className="btn btn-danger btn-sm"

                                                    onClick={() =>
                                                        eliminarCategoria(
                                                            categoria.id
                                                        )
                                                    }

                                                >

                                                    <i className="bi bi-trash me-1"></i>

                                                    Eliminar

                                                </button>

                                            </div>

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    )}

                </div>

            </div>

        </div>
    );
}

export default Categorias;