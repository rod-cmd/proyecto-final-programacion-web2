import { useEffect, useState } from "react";

function Usuarios() {

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


    const obtenerUsuarios = async () => {

        try {

            const respuesta = await fetch(
                "http://localhost:3000/api/usuarios"
            );

            const datos = await respuesta.json();

            setUsuarios(datos);

        } catch (error) {

            console.error("Error al obtener usuarios:", error);

        }
    };


    useEffect(() => {

        obtenerUsuarios();

    }, []);


    const manejarCambio = (e) => {

        const { name, value, type, checked } = e.target;

        setFormulario({
            ...formulario,
            [name]: type === "checkbox" ? checked : value
        });

    };


    const guardarUsuario = async (e) => {

        e.preventDefault();

        setMensaje("");


        try {

            let respuesta;

            if (editando) {

                respuesta = await fetch(
                    `http://localhost:3000/api/usuarios/${editando}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(formulario)
                    }
                );

            } else {

                respuesta = await fetch(
                    "http://localhost:3000/api/usuarios",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(formulario)
                    }
                );

            }


            const datos = await respuesta.json();


            if (!respuesta.ok) {

                setMensaje(datos.mensaje);

                return;

            }


            setMensaje(datos.mensaje);

            limpiarFormulario();

            obtenerUsuarios();


        } catch (error) {

            console.error("Error:", error);

            setMensaje("Error al conectar con el servidor");

        }

    };


    const editarUsuario = (usuario) => {

        setEditando(usuario.id);

        setFormulario({
            nombre: usuario.nombre,
            usuario: usuario.usuario,
            password: "",
            rol: usuario.rol,
            estado: usuario.estado
        });

        setMensaje("");

    };


    const cambiarEstado = async (usuario) => {

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
                        estado: !usuario.estado
                    })
                }
            );


            const datos = await respuesta.json();

            setMensaje(datos.mensaje);

            obtenerUsuarios();

        } catch (error) {

            console.error("Error:", error);

        }

    };


    const eliminarUsuario = async (id) => {

        if (!window.confirm("¿Está seguro de eliminar este usuario?")) {
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

            setMensaje(datos.mensaje);

            obtenerUsuarios();

        } catch (error) {

            console.error("Error:", error);

        }

    };


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


    return (

        <div className="p-4">

            <h2>Usuarios</h2>

            <p className="text-muted mb-4">
                Administración de usuarios del sistema
            </p>


            {mensaje && (

                <div className="alert alert-info">

                    {mensaje}

                </div>

            )}


            <div className="card shadow-sm border-0 mb-4">

                <div className="card-body">

                    <h5 className="mb-3">

                        {editando
                            ? "Editar usuario"
                            : "Registrar usuario"}

                    </h5>


                    <form onSubmit={guardarUsuario}>

                        <div className="row">

                            <div className="col-md-4 mb-3">

                                <label className="form-label">
                                    Nombre
                                </label>

                                <input
                                    type="text"
                                    name="nombre"
                                    className="form-control"
                                    value={formulario.nombre}
                                    onChange={manejarCambio}
                                    required
                                />

                            </div>


                            <div className="col-md-4 mb-3">

                                <label className="form-label">
                                    Usuario
                                </label>

                                <input
                                    type="text"
                                    name="usuario"
                                    className="form-control"
                                    value={formulario.usuario}
                                    onChange={manejarCambio}
                                    required
                                />

                            </div>


                            <div className="col-md-4 mb-3">

                                <label className="form-label">
                                    Contraseña
                                </label>

                                <input
                                    type="password"
                                    name="password"
                                    className="form-control"
                                    value={formulario.password}
                                    onChange={manejarCambio}
                                    placeholder={
                                        editando
                                            ? "Dejar vacío para mantener"
                                            : ""
                                    }
                                    required={!editando}
                                />

                            </div>


                            <div className="col-md-4 mb-3">

                                <label className="form-label">
                                    Rol
                                </label>

                                <select
                                    name="rol"
                                    className="form-select"
                                    value={formulario.rol}
                                    onChange={manejarCambio}
                                >

                                    <option value="Administrador">
                                        Administrador
                                    </option>

                                    <option value="Empleado">
                                        Empleado
                                    </option>

                                </select>

                            </div>


                            <div className="col-md-4 mb-3">

                                <label className="form-label d-block">
                                    Estado
                                </label>

                                <div className="form-check form-switch mt-2">

                                    <input
                                        type="checkbox"
                                        name="estado"
                                        className="form-check-input"
                                        checked={formulario.estado}
                                        onChange={manejarCambio}
                                    />

                                    <label className="form-check-label">
                                        {formulario.estado
                                            ? "Activo"
                                            : "Inactivo"}
                                    </label>

                                </div>

                            </div>

                        </div>


                        <button
                            type="submit"
                            className="btn btn-primary me-2"
                        >
                            {editando
                                ? "Actualizar usuario"
                                : "Registrar usuario"}
                        </button>


                        {editando && (

                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={limpiarFormulario}
                            >
                                Cancelar
                            </button>

                        )}

                    </form>

                </div>

            </div>


            <div className="card shadow-sm border-0">

                <div className="card-body">

                    <h5 className="mb-3">
                        Usuarios registrados
                    </h5>


                    <div className="table-responsive">

                        <table className="table table-hover align-middle">

                            <thead className="table-dark">

                                <tr>

                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Usuario</th>
                                    <th>Rol</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>

                                </tr>

                            </thead>


                            <tbody>

                                {usuarios.map((usuario) => (

                                    <tr key={usuario.id}>

                                        <td>
                                            {usuario.id}
                                        </td>

                                        <td>
                                            {usuario.nombre}
                                        </td>

                                        <td>
                                            {usuario.usuario}
                                        </td>

                                        <td>

                                            <span className={
                                                usuario.rol === "Administrador"
                                                    ? "badge bg-primary"
                                                    : "badge bg-secondary"
                                            }>
                                                {usuario.rol}
                                            </span>

                                        </td>

                                        <td>

                                            <span className={
                                                usuario.estado
                                                    ? "badge bg-success"
                                                    : "badge bg-danger"
                                            }>
                                                {usuario.estado
                                                    ? "Activo"
                                                    : "Inactivo"}
                                            </span>

                                        </td>

                                        <td>

                                            <button
                                                className="btn btn-sm btn-warning me-2"
                                                onClick={() =>
                                                    editarUsuario(usuario)
                                                }
                                            >
                                                Editar
                                            </button>


                                            <button
                                                className={
                                                    usuario.estado
                                                        ? "btn btn-sm btn-secondary me-2"
                                                        : "btn btn-sm btn-success me-2"
                                                }
                                                onClick={() =>
                                                    cambiarEstado(usuario)
                                                }
                                            >
                                                {usuario.estado
                                                    ? "Desactivar"
                                                    : "Activar"}
                                            </button>


                                            <button
                                                className="btn btn-sm btn-danger"
                                                onClick={() =>
                                                    eliminarUsuario(usuario.id)
                                                }
                                            >
                                                Eliminar
                                            </button>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default Usuarios;