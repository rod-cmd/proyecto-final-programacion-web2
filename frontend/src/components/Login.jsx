import { useState } from "react";

function Login({ iniciarSesion }) {

    const [usuario, setUsuario] = useState("");
    const [password, setPassword] = useState("");
    const [mensaje, setMensaje] = useState("");

    const manejarLogin = async (e) => {

        e.preventDefault();

        if (!usuario || !password) {
            setMensaje("Ingrese usuario y contraseña");
            return;
        }

        try {

            const respuesta = await fetch(
                "http://localhost:3000/api/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        usuario,
                        password
                    })
                }
            );

            const datos = await respuesta.json();

            if (!respuesta.ok) {
                setMensaje(datos.mensaje);
                return;
            }

            iniciarSesion(datos.usuario);

        } catch (error) {

            setMensaje(
                "No se pudo conectar con el servidor"
            );

        }
    };

    return (

        <div
    className="container-fluid vh-100 d-flex justify-content-center align-items-center"
    style={{
        background: "linear-gradient(135deg, #e9f2ff, #f8f9fa)"
    }}
>

            <div
    className="card shadow-lg border-0"
    style={{
        width: "400px",
        borderRadius: "18px"
    }}
>

                <div className="card-body p-4">

                    {/* ICONO */}

                    <div className="text-center mb-3">

                        <div
                            className="bg-primary text-white rounded-circle mx-auto d-flex align-items-center justify-content-center"
                            style={{
                                width: "70px",
                                height: "70px",
                                fontSize: "32px"
                            }}
                        >
                            <i className="bi bi-pc-display"></i>
                        </div>

                    </div>


                    {/* TÍTULO */}

<h3 className="text-center fw-bold mb-1">
    TecnoNova S.R.L.
</h3>

<p className="text-center text-muted mb-4">
    Sistema de Gestión de Equipos Tecnológicos
</p>


                    {/* FORMULARIO */}

                    <form onSubmit={manejarLogin}>

                        <div className="mb-3">

                            <label className="form-label fw-semibold">
                                Usuario
                            </label>

                            <div className="input-group">

                                <span className="input-group-text">
                                    <i className="bi bi-person"></i>
                                </span>

                                <input
                                    type="text"
                                    className="form-control"
                                    value={usuario}
                                    onChange={(e) =>
                                        setUsuario(e.target.value)
                                    }
                                    placeholder="Ingrese su usuario"
                                />

                            </div>

                        </div>


                        <div className="mb-3">

                            <label className="form-label fw-semibold">
                                Contraseña
                            </label>

                            <div className="input-group">

                                <span className="input-group-text">
                                    <i className="bi bi-lock"></i>
                                </span>

                                <input
                                    type="password"
                                    className="form-control"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    placeholder="Ingrese su contraseña"
                                />

                            </div>

                        </div>


                        {/* MENSAJE DE ERROR */}

                        {mensaje && (

                            <div className="alert alert-danger py-2">
                                <i className="bi bi-exclamation-circle me-2"></i>
                                {mensaje}
                            </div>

                        )}


                        {/* BOTÓN */}

                        <button
                            type="submit"
                            className="btn btn-primary w-100 py-2"
                        >
                            <i className="bi bi-box-arrow-in-right me-2"></i>
                            Ingresar
                        </button>

                    </form>

                </div>

            </div>

        </div>

    );
}

export default Login;