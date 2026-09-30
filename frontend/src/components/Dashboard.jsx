import { useEffect, useState } from "react";

function Dashboard() {

    const [cantidadEquipos, setCantidadEquipos] = useState(0);
    const [cantidadCategorias, setCantidadCategorias] = useState(0);
    const [cantidadUsuarios, setCantidadUsuarios] = useState(0);

    useEffect(() => {

        const cargarDatos = async () => {

            try {

                const respuestaEquipos = await fetch(
                    "http://localhost:3000/api/equipos"
                );

                const equipos = await respuestaEquipos.json();

                setCantidadEquipos(equipos.length);


                const respuestaCategorias = await fetch(
                    "http://localhost:3000/api/categorias"
                );

                const categorias = await respuestaCategorias.json();

                setCantidadCategorias(categorias.length);


                const respuestaUsuarios = await fetch(
                    "http://localhost:3000/api/usuarios"
                );

                const usuarios = await respuestaUsuarios.json();

                setCantidadUsuarios(usuarios.length);

            } catch (error) {

                console.error(
                    "Error al cargar datos del dashboard:",
                    error
                );

            }
        };

        cargarDatos();

    }, []);


    return (

        <div className="p-4">

            <div className="mb-4">

                <h2 className="fw-bold">
                    Dashboard
                </h2>

                <p className="text-muted">
                    Resumen general del sistema de gestión
                </p>

            </div>


            <div className="row g-4">


                {/* EQUIPOS */}

                <div className="col-md-4">

                    <div className="card border-0 shadow-sm h-100">

                        <div className="card-body d-flex align-items-center">

                            <div
                                className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                                style={{
                                    width: "60px",
                                    height: "60px",
                                    fontSize: "28px"
                                }}
                            >
                                💻
                            </div>

                            <div>

                                <h6 className="text-muted mb-1">
                                    Equipos registrados
                                </h6>

                                <h2 className="fw-bold mb-0">
                                    {cantidadEquipos}
                                </h2>

                            </div>

                        </div>

                    </div>

                </div>


                {/* CATEGORÍAS */}

                <div className="col-md-4">

                    <div className="card border-0 shadow-sm h-100">

                        <div className="card-body d-flex align-items-center">

                            <div
                                className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                                style={{
                                    width: "60px",
                                    height: "60px",
                                    fontSize: "28px"
                                }}
                            >
                                📁
                            </div>

                            <div>

                                <h6 className="text-muted mb-1">
                                    Categorías
                                </h6>

                                <h2 className="fw-bold mb-0">
                                    {cantidadCategorias}
                                </h2>

                            </div>

                        </div>

                    </div>

                </div>


                {/* USUARIOS */}

                <div className="col-md-4">

                    <div className="card border-0 shadow-sm h-100">

                        <div className="card-body d-flex align-items-center">

                            <div
                                className="bg-warning text-dark rounded-circle d-flex align-items-center justify-content-center me-3"
                                style={{
                                    width: "60px",
                                    height: "60px",
                                    fontSize: "28px"
                                }}
                            >
                                👤
                            </div>

                            <div>

                                <h6 className="text-muted mb-1">
                                    Usuarios
                                </h6>

                                <h2 className="fw-bold mb-0">
                                    {cantidadUsuarios}
                                </h2>

                            </div>

                        </div>

                    </div>

                </div>


            </div>


            {/* MENSAJE INFORMATIVO */}

            <div className="card border-0 shadow-sm mt-4">

                <div className="card-body">

                    <h5 className="fw-bold">
                        Sistema de Gestión de Equipos Tecnológicos
                    </h5>

                    <p className="text-muted mb-0">
                        Desde este sistema puede administrar equipos,
                        categorías y usuarios de la institución.
                    </p>

                </div>

            </div>

        </div>

    );
}

export default Dashboard;