import { useEffect, useState } from "react";

function Usuarios() {

// ==============================
// ESTADOS
// ==============================

const [usuarios, setUsuarios] = useState([]);

const [formulario, setFormulario] = useState({
    nombre: "",
    usuario: "",
    password: "",
    rol: "Empleado",
    estado: true
});

const [editando, setEditando] = useState(null);

const [mensaje, setMensaje] = useState("");
const [tipoMensaje, setTipoMensaje] = useState("info");

// Búsqueda y ordenamiento
const [busqueda, setBusqueda] = useState("");
const [orden, setOrden] = useState("nombre");


// ==============================
// OBTENER USUARIOS
// ==============================

const obtenerUsuarios = async () => {

    try {

        const respuesta = await fetch(
            "http://localhost:3000/api/usuarios"
        );

        const datos = await respuesta.json();

        if (!respuesta.ok) {

            mostrarMensaje(
                datos.mensaje ||
                "No se pudieron obtener los usuarios.",
                "danger"
            );

            return;
        }

        setUsuarios(datos);

    } catch (error) {

        console.error(
            "Error al obtener usuarios:",
            error
        );

        mostrarMensaje(
            "Error al conectar con el servidor.",
            "danger"
        );
    }
};


// ==============================
// CARGAR AL INICIAR
// ==============================

useEffect(() => {

    obtenerUsuarios();

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

    const {
        name,
        value,
        type,
        checked
    } = e.target;

    setFormulario({
        ...formulario,
        [name]:
            type === "checkbox"
                ? checked
                : value
    });
};


// ==============================
// LIMPIAR FORMULARIO
// ==============================

const limpiarFormulario = () => {

    setFormulario({
        nombre: "",
        usuario: "",
        password: "",
        rol: "Empleado",
        estado: true
    });

    setEditando(null);
};


// ==============================
// REGISTRAR / ACTUALIZAR
// ==============================

const guardarUsuario = async (e) => {

    e.preventDefault();

    const nombre = formulario.nombre.trim();
    const usuario = formulario.usuario.trim();

    if (!nombre) {

        mostrarMensaje(
            "Complete correctamente el nombre.",
            "warning"
        );

        return;
    }

    if (!usuario) {

        mostrarMensaje(
            "Complete correctamente el nombre de usuario.",
            "warning"
        );

        return;
    }

    // La contraseña es obligatoria solamente al registrar
    if (!editando && !formulario.password.trim()) {

        mostrarMensaje(
            "La contraseña es obligatoria.",
            "warning"
        );

        return;
    }


    try {

        const url = editando
            ? `http://localhost:3000/api/usuarios/${editando}`
            : "http://localhost:3000/api/usuarios";

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

                usuario: usuario,

                // Al editar, si la contraseña está vacía,
                // se envía vacía para que el backend pueda
                // mantener la contraseña actual si así está programado.
                password: formulario.password.trim(),

                estado:
                    formulario.estado === true ||
                    formulario.estado === "true"

            })

        });


        const datos = await respuesta.json();


        if (!respuesta.ok) {

            mostrarMensaje(
                datos.mensaje ||
                "No se pudo guardar el usuario.",
                "danger"
            );

            return;
        }


        mostrarMensaje(

            editando
                ? "Usuario actualizado correctamente."
                : "Usuario registrado correctamente.",

            "success"

        );


        limpiarFormulario();

        obtenerUsuarios();


    } catch (error) {

        console.error(
            "Error al guardar usuario:",
            error
        );

        mostrarMensaje(
            "Error al conectar con el servidor.",
            "danger"
        );
    }
};


// ==============================
// EDITAR
// ==============================

const editarUsuario = (usuario) => {

    setEditando(usuario.id);

    setFormulario({

        nombre: usuario.nombre || "",

        usuario: usuario.usuario || "",

        password: "",

        rol: usuario.rol || "Empleado",

        estado:
            usuario.estado === true ||
            usuario.estado === "true"

    });

    setMensaje("");
};


// ==============================
// CAMBIAR ESTADO
// ==============================

const cambiarEstado = async (usuario) => {

    const nuevoEstado =
        !(
            usuario.estado === true ||
            usuario.estado === "true"
        );


    try {

        const respuesta = await fetch(

            `http://localhost:3000/api/usuarios/${usuario.id}`,

            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    nombre: usuario.nombre,

                    usuario: usuario.usuario,

                    password: "",

                    rol: usuario.rol,

                    estado: nuevoEstado

                })
            }
        );


        const datos = await respuesta.json();


        if (!respuesta.ok) {

            mostrarMensaje(
                datos.mensaje ||
                "No se pudo cambiar el estado del usuario.",
                "danger"
            );

            return;
        }


        mostrarMensaje(
            nuevoEstado
                ? "Usuario activado correctamente."
                : "Usuario desactivado correctamente.",
            "success"
        );


        obtenerUsuarios();


    } catch (error) {

        console.error(
            "Error al cambiar estado:",
            error
        );

        mostrarMensaje(
            "Error al conectar con el servidor.",
            "danger"
        );
    }
};


// ==============================
// ELIMINAR
// ==============================

const eliminarUsuario = async (id) => {

    const confirmar = window.confirm(
        "¿Está seguro de eliminar este usuario?"
    );


    if (!confirmar) {
        return;
    }


    try {

        const respuesta = await fetch(

            `http://localhost:3000/api/usuarios/${id}`,

            {
                method: "DELETE"
            }
        );


        const datos = await respuesta.json();


        if (!respuesta.ok) {

            mostrarMensaje(
                datos.mensaje ||
                "No se pudo eliminar el usuario.",
                "danger"
            );

            return;
        }


        mostrarMensaje(
            "Usuario eliminado correctamente.",
            "success"
        );


        if (editando === id) {

            limpiarFormulario();

        }


        obtenerUsuarios();


    } catch (error) {

        console.error(
            "Error al eliminar usuario:",
            error
        );

        mostrarMensaje(
            "Error al conectar con el servidor.",
            "danger"
        );
    }
};


// ==============================
// USUARIOS FILTRADOS
// ==============================

const usuariosFiltrados = usuarios

    .filter((usuario) => {

        const texto = busqueda.toLowerCase();

        return (

            (usuario.nombre &&
                usuario.nombre
                    .toLowerCase()
                    .includes(texto))

            ||

            (usuario.usuario &&
                usuario.usuario
                    .toLowerCase()
                    .includes(texto))

            ||

            (usuario.rol &&
                usuario.rol
                    .toLowerCase()
                    .includes(texto))

        );
    })


    .sort((a, b) => {

        if (orden === "nombre") {

            return (a.nombre || "")
                .localeCompare(
                    b.nombre || ""
                );
        }


        if (orden === "usuario") {

            return (a.usuario || "")
                .localeCompare(
                    b.usuario || ""
                );
        }


        if (orden === "rol") {

            return (a.rol || "")
                .localeCompare(
                    b.rol || ""
                );
        }


        if (orden === "estado") {

            return Number(
                b.estado === true ||
                b.estado === "true"
            )
            -
            Number(
                a.estado === true ||
                a.estado === "true"
            );
        }


        if (orden === "id") {

            return a.id - b.id;
        }


        return 0;
    });


// ==============================
// CONTADORES
// ==============================

const usuariosActivos = usuarios.filter(
    (usuario) =>
        usuario.estado === true ||
        usuario.estado === "true"
);


const usuariosInactivos = usuarios.filter(
    (usuario) =>
        !(
            usuario.estado === true ||
            usuario.estado === "true"
        )
);


const administradores = usuarios.filter(
    (usuario) =>
        usuario.rol === "Administrador"
);


// ==============================
// EXPORTAR TXT
// ==============================

const exportarTXT = () => {

    if (usuarios.length === 0) {

        mostrarMensaje(
            "No hay usuarios para exportar.",
            "warning"
        );

        return;
    }


    let contenido =
        "USUARIOS DEL SISTEMA\n";


    contenido +=
        "===================================\n\n";


    usuarios.forEach((usuario) => {

        contenido +=
            `ID: ${usuario.id}\n`;

        contenido +=
            `Nombre: ${usuario.nombre}\n`;

        contenido +=
            `Usuario: ${usuario.usuario}\n`;

        contenido +=
            `Rol: ${usuario.rol}\n`;

        contenido +=
            `Estado: ${
                usuario.estado
                    ? "Activo"
                    : "Inactivo"
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
        "usuarios_sistema.txt";


    enlace.click();


    URL.revokeObjectURL(url);


    mostrarMensaje(
        "Usuarios exportados correctamente.",
        "success"
    );
};


// ==============================
// ICONO SEGÚN ROL
// ==============================

const obtenerIcono = (rol) => {

    switch (rol) {

        case "Administrador":
            return "bi bi-shield-lock";

        case "Empleado":
            return "bi bi-person";

        default:
            return "bi bi-person-circle";
    }
};


// ==============================
// RENDERIZADO
// ==============================

return (

    <div className="p-4">


        {/* ==============================
            ENCABEZADO
        ============================== */}

        <div className="mb-4">

            <h2>
                Usuarios
            </h2>

            <p className="text-muted">
                Administración de usuarios del sistema
            </p>

        </div>


        {/* ==============================
            RESUMEN
        ============================== */}

        <div className="row g-3 mb-4">


            {/* TOTAL */}

            <div className="col-md-3">

                <div className="card shadow-sm border-0 h-100">

                    <div className="card-body">

                        <div className="d-flex justify-content-between align-items-center">

                            <div>

                                <p className="text-muted mb-1">
                                    Total de usuarios
                                </p>

                                <h3 className="fw-bold mb-0">
                                    {usuarios.length}
                                </h3>

                            </div>

                            <div className="fs-1 text-primary">

                                <i className="bi bi-people"></i>

                            </div>

                        </div>

                    </div>

                </div>

            </div>


            {/* ACTIVOS */}

            <div className="col-md-3">

                <div className="card shadow-sm border-0 h-100">

                    <div className="card-body">

                        <div className="d-flex justify-content-between align-items-center">

                            <div>

                                <p className="text-muted mb-1">
                                    Usuarios activos
                                </p>

                                <h3 className="fw-bold mb-0 text-success">
                                    {usuariosActivos.length}
                                </h3>

                            </div>

                            <div className="fs-1 text-success">

                                <i className="bi bi-check-circle"></i>

                            </div>

                        </div>

                    </div>

                </div>

            </div>


            {/* INACTIVOS */}

            <div className="col-md-3">

                <div className="card shadow-sm border-0 h-100">

                    <div className="card-body">

                        <div className="d-flex justify-content-between align-items-center">

                            <div>

                                <p className="text-muted mb-1">
                                    Usuarios inactivos
                                </p>

                                <h3 className="fw-bold mb-0 text-secondary">
                                    {usuariosInactivos.length}
                                </h3>

                            </div>

                            <div className="fs-1 text-secondary">

                                <i className="bi bi-dash-circle"></i>

                            </div>

                        </div>

                    </div>

                </div>

            </div>


            {/* ADMINISTRADORES */}

            <div className="col-md-3">

                <div className="card shadow-sm border-0 h-100">

                    <div className="card-body">

                        <div className="d-flex justify-content-between align-items-center">

                            <div>

                                <p className="text-muted mb-1">
                                    Administradores
                                </p>

                                <h3 className="fw-bold mb-0 text-primary">
                                    {administradores.length}
                                </h3>

                            </div>

                            <div className="fs-1 text-primary">

                                <i className="bi bi-shield-lock"></i>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>


        {/* ==============================
            ALERTA
        ============================== */}

        {usuariosInactivos.length > 0 && (

            <div className="alert alert-warning shadow-sm">

                <h6 className="fw-bold">

                    <i className="bi bi-exclamation-triangle me-2"></i>

                    Usuarios inactivos

                </h6>

                <p className="mb-0">

                    Actualmente existen{" "}

                    <strong>
                        {usuariosInactivos.length}
                    </strong>{" "}

                    usuarios marcados como inactivos.

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
                        ? "Editar usuario"
                        : "Registrar nuevo usuario"}

                </h5>


                <form onSubmit={guardarUsuario}>

                    <div className="row g-3">


                        {/* NOMBRE */}

                        <div className="col-md-4">

                            <label className="form-label">
                                Nombre
                            </label>

                            <input

                                type="text"

                                className="form-control"

                                name="nombre"

                                placeholder="Nombre completo"

                                value={
                                    formulario.nombre
                                }

                                onChange={
                                    manejarCambio
                                }

                                required

                            />

                        </div>


                        {/* USUARIO */}

                        <div className="col-md-4">

                            <label className="form-label">
                                Usuario
                            </label>

                            <input

                                type="text"

                                className="form-control"

                                name="usuario"

                                placeholder="Nombre de usuario"

                                value={
                                    formulario.usuario
                                }

                                onChange={
                                    manejarCambio
                                }

                                required

                            />

                        </div>


                        {/* CONTRASEÑA */}

                        <div className="col-md-4">

                            <label className="form-label">
                                Contraseña
                            </label>

                            <input

                                type="password"

                                className="form-control"

                                name="password"

                                value={
                                    formulario.password
                                }

                                onChange={
                                    manejarCambio
                                }

                                placeholder={
                                    editando
                                        ? "Dejar vacío para mantener"
                                        : "Contraseña"
                                }

                                required={!editando}

                            />

                        </div>


                        {/* ROL */}

                        <div className="col-md-4">

                            <label className="form-label">
                                Rol
                            </label>

                            <select

                                name="rol"

                                className="form-select"

                                value={
                                    formulario.rol
                                }

                                onChange={
                                    manejarCambio
                                }

                            >

                                <option value="Administrador">
                                    Administrador
                                </option>

                                <option value="Empleado">
                                    Empleado
                                </option>

                            </select>

                        </div>


                        {/* ESTADO */}

                        <div className="col-md-4">

                            <label className="form-label d-block">
                                Estado
                            </label>

                            <div className="form-check form-switch mt-2">

                                <input

                                    type="checkbox"

                                    name="estado"

                                    className="form-check-input"

                                    checked={
                                        formulario.estado === true ||
                                        formulario.estado === "true"
                                    }

                                    onChange={
                                        manejarCambio
                                    }

                                />

                                <label className="form-check-label">

                                    {(
                                        formulario.estado === true ||
                                        formulario.estado === "true"
                                    )
                                        ? "Activo"
                                        : "Inactivo"}

                                </label>

                            </div>

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
                                ? "Actualizar usuario"
                                : "Registrar usuario"}

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
                            Usuarios registrados
                        </h5>

                        <p className="text-muted mb-0">
                            Usuarios disponibles en el sistema
                        </p>

                    </div>


                    <div className="d-flex align-items-center gap-2">

                        <span className="badge bg-primary fs-6">

                            {usuariosFiltrados.length}{" "}

                            {usuariosFiltrados.length === 1
                                ? "usuario"
                                : "usuarios"}

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

                                placeholder="Buscar por nombre, usuario o rol..."

                                value={
                                    busqueda
                                }

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

                            value={
                                orden
                            }

                            onChange={(e) =>
                                setOrden(
                                    e.target.value
                                )
                            }

                        >

                            <option value="nombre">
                                Ordenar por nombre
                            </option>

                            <option value="usuario">
                                Ordenar por usuario
                            </option>

                            <option value="rol">
                                Ordenar por rol
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

                {usuarios.length === 0 ? (

                    <div className="text-center py-5">

                        <div
                            style={{
                                fontSize: "60px"
                            }}
                        >

                            <i className="bi bi-people"></i>

                        </div>


                        <h5 className="mt-3">

                            No existen usuarios registrados

                        </h5>


                        <p className="text-muted">

                            Registra un usuario utilizando
                            el formulario superior.

                        </p>

                    </div>


                ) : usuariosFiltrados.length === 0 ? (

                    <div className="text-center py-5">

                        <div
                            style={{
                                fontSize: "60px"
                            }}
                        >

                            <i className="bi bi-search"></i>

                        </div>


                        <h5 className="mt-3">

                            No se encontraron usuarios

                        </h5>


                        <p className="text-muted">

                            Intenta con otro nombre,
                            usuario o rol.

                        </p>

                    </div>


                ) : (


                    /* ==============================
                       TARJETAS
                    ============================== */

                    <div className="row g-4">

                        {usuariosFiltrados.map(
                            (usuario) => (

                                <div

                                    className="col-md-6 col-lg-4"

                                    key={usuario.id}

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
                                                        usuario.rol
                                                    )
                                                }

                                            ></i>

                                        </div>


                                        {/* INFORMACIÓN */}

                                        <div className="card-body">


                                            <div className="d-flex justify-content-between align-items-start mb-3">

                                                <h5 className="card-title fw-bold mb-0">

                                                    {usuario.nombre}

                                                </h5>


                                                {(
                                                    usuario.estado === true ||
                                                    usuario.estado === "true"
                                                ) ? (

                                                    <span className="badge bg-success">

                                                        Activo

                                                    </span>

                                                ) : (

                                                    <span className="badge bg-secondary">

                                                        Inactivo

                                                    </span>

                                                )}

                                            </div>


                                            <p className="mb-2">

                                                <i className="bi bi-person me-2"></i>

                                                <strong>
                                                    Usuario:
                                                </strong>{" "}

                                                {usuario.usuario}

                                            </p>


                                            <p className="mb-2">

                                                <i className="bi bi-shield me-2"></i>

                                                <strong>
                                                    Rol:
                                                </strong>{" "}

                                                {usuario.rol}

                                            </p>


                                            <p className="small text-muted mb-0">

                                                <i className="bi bi-hash"></i>

                                                ID de usuario:
                                                {" "}

                                                {usuario.id}

                                            </p>

                                        </div>


                                        {/* BOTONES */}

                                        <div className="card-footer bg-white border-0">


                                            <button

                                                className="btn btn-warning btn-sm me-2"

                                                onClick={() =>
                                                    editarUsuario(
                                                        usuario
                                                    )
                                                }

                                            >

                                                <i className="bi bi-pencil me-1"></i>

                                                Editar

                                            </button>


                                            <button

                                                className={
                                                    (
                                                        usuario.estado === true ||
                                                        usuario.estado === "true"
                                                    )

                                                        ? "btn btn-secondary btn-sm me-2"

                                                        : "btn btn-success btn-sm me-2"
                                                }

                                                onClick={() =>
                                                    cambiarEstado(
                                                        usuario
                                                    )
                                                }

                                            >

                                                <i
                                                    className={
                                                        (
                                                            usuario.estado === true ||
                                                            usuario.estado === "true"
                                                        )

                                                            ? "bi bi-person-dash me-1"

                                                            : "bi bi-person-check me-1"
                                                    }
                                                ></i>

                                                {(
                                                    usuario.estado === true ||
                                                    usuario.estado === "true"
                                                )
                                                    ? "Desactivar"
                                                    : "Activar"}

                                            </button>


                                            <button

                                                className="btn btn-danger btn-sm"

                                                onClick={() =>
                                                    eliminarUsuario(
                                                        usuario.id
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

export default Usuarios;