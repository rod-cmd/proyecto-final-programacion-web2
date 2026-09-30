function Navbar({ usuario, cerrarSesion }) {
    return (
        <nav className="navbar navbar-light bg-white border-bottom px-4">

            <div>
                <span className="navbar-brand mb-0 h5">
                    Sistema de Gestión de Equipos Tecnológicos
                </span>
            </div>

            <div className="d-flex align-items-center gap-3">

                <div className="text-end">
                    <div className="fw-semibold">
                        {usuario.nombre}
                    </div>

                    <small className="text-muted">
                        {usuario.rol}
                    </small>
                </div>

                <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={cerrarSesion}
                >
                    Cerrar sesión
                </button>

            </div>

        </nav>
    );
}

export default Navbar;
