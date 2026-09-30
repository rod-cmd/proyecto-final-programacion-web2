function Sidebar({ cambiarPagina, usuario }) {
    return (
        <div
            className="bg-dark text-white p-3 d-flex flex-column"
            style={{
                width: "250px",
                minHeight: "100vh"
            }}
        >

            {/* TÍTULO */}
            <div className="text-center mb-4">

                <div
                    className="bg-primary rounded-circle mx-auto mb-2 d-flex align-items-center justify-content-center"
                    style={{
                        width: "55px",
                        height: "55px",
                        fontSize: "26px"
                    }}
                >
                    <i className="bi bi-pc-display"></i>
                </div>

                <h5 className="mb-1">
                    Gestión de Equipos
                </h5>

                <small className="text-secondary">
                    Sistema Web
                </small>

            </div>


            {/* MENÚ */}
            <ul className="nav flex-column">

                {/* DASHBOARD */}
                <li className="nav-item mb-2">

                    <button
                        className="btn btn-dark text-start w-100"
                        onClick={() => cambiarPagina("dashboard")}
                    >
                        <i className="bi bi-speedometer2 me-2"></i>
                        Dashboard
                    </button>

                </li>


                {/* EQUIPOS */}
                <li className="nav-item mb-2">

                    <button
                        className="btn btn-dark text-start w-100"
                        onClick={() => cambiarPagina("equipos")}
                    >
                        <i className="bi bi-laptop me-2"></i>
                        Equipos
                    </button>

                </li>


                {/* CATEGORÍAS */}
                <li className="nav-item mb-2">

                    <button
                        className="btn btn-dark text-start w-100"
                        onClick={() => cambiarPagina("categorias")}
                    >
                        <i className="bi bi-folder me-2"></i>
                        Categorías
                    </button>

                </li>


                {/* USUARIOS - SOLO ADMINISTRADOR */}
                {usuario.rol === "Administrador" && (

                    <li className="nav-item mb-2">

                        <button
                            className="btn btn-dark text-start w-100"
                            onClick={() => cambiarPagina("usuarios")}
                        >
                            <i className="bi bi-people me-2"></i>
                            Usuarios
                        </button>

                    </li>

                )}

            </ul>


            {/* INFORMACIÓN DEL USUARIO */}
            <div className="mt-auto border-top pt-3">

                <div className="d-flex align-items-center">

                    <div
                        className="bg-secondary rounded-circle d-flex align-items-center justify-content-center me-2"
                        style={{
                            width: "38px",
                            height: "38px"
                        }}
                    >
                        <i className="bi bi-person"></i>
                    </div>

                    <div>

                        <div className="small fw-semibold">
                            {usuario.nombre}
                        </div>

                        <div className="small text-secondary">
                            {usuario.rol}
                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Sidebar;