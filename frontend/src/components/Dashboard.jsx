import { useEffect, useState } from "react";

function Dashboard() {

// ==========================================
// ESTADOS PRINCIPALES
// ==========================================

const [equipos, setEquipos] = useState([]);
const [categorias, setCategorias] = useState([]);
const [usuarios, setUsuarios] = useState([]);

const [cargando, setCargando] = useState(true);


// ==========================================
// CARGAR DATOS
// ==========================================

useEffect(() => {

    const cargarDatos = async () => {

        try {

            setCargando(true);


            // ==========================================
            // EQUIPOS
            // ==========================================

            const respuestaEquipos = await fetch(
                "http://localhost:3000/api/equipos"
            );

            if (!respuestaEquipos.ok) {
                throw new Error(
                    "No se pudieron obtener los equipos"
                );
            }

            const datosEquipos =
                await respuestaEquipos.json();


            // ==========================================
            // CATEGORÍAS
            // ==========================================

            const respuestaCategorias = await fetch(
                "http://localhost:3000/api/categorias"
            );

            if (!respuestaCategorias.ok) {
                throw new Error(
                    "No se pudieron obtener las categorías"
                );
            }

            const datosCategorias =
                await respuestaCategorias.json();


            // ==========================================
            // USUARIOS
            // ==========================================

            const respuestaUsuarios = await fetch(
                "http://localhost:3000/api/usuarios"
            );

            if (!respuestaUsuarios.ok) {
                throw new Error(
                    "No se pudieron obtener los usuarios"
                );
            }

            const datosUsuarios =
                await respuestaUsuarios.json();


            // ==========================================
            // GUARDAR DATOS
            // ==========================================

            setEquipos(
                Array.isArray(datosEquipos)
                    ? datosEquipos
                    : []
            );

            setCategorias(
                Array.isArray(datosCategorias)
                    ? datosCategorias
                    : []
            );

            setUsuarios(
                Array.isArray(datosUsuarios)
                    ? datosUsuarios
                    : []
            );


        } catch (error) {

            console.error(
                "Error al cargar datos del dashboard:",
                error
            );


        } finally {

            setCargando(false);

        }

    };


    cargarDatos();

}, []);


// ==========================================
// FUNCIONES PARA ESTADOS
// ==========================================

const estaActivo = (elemento) => {

    return (
        elemento.estado === true ||
        elemento.estado === "true"
    );

};


// ==========================================
// CONTADORES DE USUARIOS
// ==========================================

const usuariosActivos =
    usuarios.filter(
        (usuario) =>
            estaActivo(usuario)
    );


const usuariosInactivos =
    usuarios.filter(
        (usuario) =>
            !estaActivo(usuario)
    );


const administradores =
    usuarios.filter(
        (usuario) =>
            usuario.rol === "Administrador"
    );


// ==========================================
// CONTADORES DE CATEGORÍAS
// ==========================================

const categoriasActivas =
    categorias.filter(
        (categoria) =>
            estaActivo(categoria)
    );


const categoriasInactivas =
    categorias.filter(
        (categoria) =>
            !estaActivo(categoria)
    );


// ==========================================
// EQUIPOS POR CATEGORÍA
// ==========================================

const contarEquiposPorCategoria = (categoria) => {

    return equipos.filter((equipo) => {

        if (
            equipo.categoriaId !== undefined &&
            equipo.categoriaId !== null
        ) {

            return (
                String(equipo.categoriaId) ===
                String(categoria.id)
            );

        }


        if (equipo.categoria !== undefined) {

            if (
                typeof equipo.categoria === "object" &&
                equipo.categoria !== null
            ) {

                return (
                    String(
                        equipo.categoria.id
                    ) ===
                    String(categoria.id)
                );

            }


            return (
                String(equipo.categoria) ===
                String(categoria.id) ||

                String(equipo.categoria) ===
                String(categoria.nombre)
            );

        }


        return false;

    }).length;

};


// ==========================================
// EQUIPOS SIN CATEGORÍA
// ==========================================

const equiposConCategoria =
    categorias.reduce(
        (total, categoria) =>
            total +
            contarEquiposPorCategoria(categoria),
        0
    );


const equiposSinCategoria =
    Math.max(
        0,
        equipos.length -
        equiposConCategoria
    );


// ==========================================
// CATEGORÍA CON MÁS EQUIPOS
// ==========================================

const categoriaPrincipal =
    categorias.length > 0
        ? categorias.reduce(
            (anterior, actual) => {

                const cantidadAnterior =
                    contarEquiposPorCategoria(
                        anterior
                    );

                const cantidadActual =
                    contarEquiposPorCategoria(
                        actual
                    );

                return cantidadActual >
                    cantidadAnterior
                    ? actual
                    : anterior;

            }
        )
        : null;


const cantidadCategoriaPrincipal =
    categoriaPrincipal
        ? contarEquiposPorCategoria(
            categoriaPrincipal
        )
        : 0;


// ==========================================
// RENDERIZADO
// ==========================================

return (

    <div className="p-4">


        {/* ==========================================
            ENCABEZADO
        ========================================== */}

        <div className="mb-4">

            <h2 className="fw-bold">
                Dashboard
            </h2>

            <p className="text-muted mb-0">
    Panel principal de TecnoNova S.R.L.
</p>

        </div>


        {/* ==========================================
            CARGANDO
        ========================================== */}

        {cargando && (

            <div className="alert alert-info">

                <i className="bi bi-arrow-repeat me-2"></i>

                Cargando información del sistema...

            </div>

        )}


        {/* ==========================================
            TARJETAS PRINCIPALES
        ========================================== */}

        <div className="row g-4">


            {/* ==========================================
                EQUIPOS
            ========================================== */}

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

                            <i className="bi bi-pc-display"></i>

                        </div>


                        <div>

                            <h6 className="text-muted mb-1">
                                Equipos registrados
                            </h6>

                            <h2 className="fw-bold mb-0">

                                {cargando
                                    ? "..."
                                    : equipos.length}

                            </h2>

                        </div>

                    </div>

                </div>

            </div>


            {/* ==========================================
                CATEGORÍAS
            ========================================== */}

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

                            <i className="bi bi-folder"></i>

                        </div>


                        <div>

                            <h6 className="text-muted mb-1">
                                Categorías
                            </h6>

                            <h2 className="fw-bold mb-0">

                                {cargando
                                    ? "..."
                                    : categorias.length}

                            </h2>

                        </div>

                    </div>

                </div>

            </div>


            {/* ==========================================
                USUARIOS
            ========================================== */}

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

                            <i className="bi bi-people"></i>

                        </div>


                        <div>

                            <h6 className="text-muted mb-1">
                                Usuarios
                            </h6>

                            <h2 className="fw-bold mb-0">

                                {cargando
                                    ? "..."
                                    : usuarios.length}

                            </h2>

                        </div>

                    </div>

                </div>

            </div>


        </div>


        {/* ==========================================
            RESUMEN DE ESTADOS
        ========================================== */}

        <div className="row g-4 mt-1">


            {/* ==========================================
                USUARIOS ACTIVOS
            ========================================== */}

            <div className="col-md-3">

                <div className="card border-0 shadow-sm h-100">

                    <div className="card-body">

                        <div className="d-flex justify-content-between align-items-center">

                            <div>

                                <p className="text-muted mb-1">
                                    Usuarios activos
                                </p>

                                <h3 className="fw-bold text-success mb-0">

                                    {usuariosActivos.length}

                                </h3>

                            </div>


                            <div className="fs-1 text-success">

                                <i className="bi bi-person-check"></i>

                            </div>

                        </div>

                    </div>

                </div>

            </div>


            {/* ==========================================
                USUARIOS INACTIVOS
            ========================================== */}

            <div className="col-md-3">

                <div className="card border-0 shadow-sm h-100">

                    <div className="card-body">

                        <div className="d-flex justify-content-between align-items-center">

                            <div>

                                <p className="text-muted mb-1">
                                    Usuarios inactivos
                                </p>

                                <h3 className="fw-bold text-secondary mb-0">

                                    {usuariosInactivos.length}

                                </h3>

                            </div>


                            <div className="fs-1 text-secondary">

                                <i className="bi bi-person-dash"></i>

                            </div>

                        </div>

                    </div>

                </div>

            </div>


            {/* ==========================================
                CATEGORÍAS ACTIVAS
            ========================================== */}

            <div className="col-md-3">

                <div className="card border-0 shadow-sm h-100">

                    <div className="card-body">

                        <div className="d-flex justify-content-between align-items-center">

                            <div>

                                <p className="text-muted mb-1">
                                    Categorías activas
                                </p>

                                <h3 className="fw-bold text-success mb-0">

                                    {categoriasActivas.length}

                                </h3>

                            </div>


                            <div className="fs-1 text-success">

                                <i className="bi bi-folder-check"></i>

                            </div>

                        </div>

                    </div>

                </div>

            </div>


            {/* ==========================================
                ADMINISTRADORES
            ========================================== */}

            <div className="col-md-3">

                <div className="card border-0 shadow-sm h-100">

                    <div className="card-body">

                        <div className="d-flex justify-content-between align-items-center">

                            <div>

                                <p className="text-muted mb-1">
                                    Administradores
                                </p>

                                <h3 className="fw-bold text-primary mb-0">

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


        {/* ==========================================
            ALERTAS DEL SISTEMA
        ========================================== */}

        <div className="row g-4 mt-1">


            {/* USUARIOS INACTIVOS */}

            {usuariosInactivos.length > 0 && (

                <div className="col-md-6">

                    <div className="alert alert-warning shadow-sm h-100 mb-0">

                        <h6 className="fw-bold">

                            <i className="bi bi-exclamation-triangle me-2"></i>

                            Usuarios inactivos

                        </h6>

                        <p className="mb-0">

                            Hay{" "}

                            <strong>
                                {usuariosInactivos.length}
                            </strong>{" "}

                            usuarios marcados como inactivos.

                        </p>

                    </div>

                </div>

            )}


            {/* CATEGORÍAS INACTIVAS */}

            {categoriasInactivas.length > 0 && (

                <div className="col-md-6">

                    <div className="alert alert-warning shadow-sm h-100 mb-0">

                        <h6 className="fw-bold">

                            <i className="bi bi-folder-x me-2"></i>

                            Categorías inactivas

                        </h6>

                        <p className="mb-0">

                            Hay{" "}

                            <strong>
                                {categoriasInactivas.length}
                            </strong>{" "}

                            categorías marcadas como inactivas.

                        </p>

                    </div>

                </div>

            )}


        </div>


        {/* ==========================================
            INFORMACIÓN DE EQUIPOS
        ========================================== */}

        <div className="row g-4 mt-1">


            {/* TOTAL EQUIPOS */}

            <div className="col-md-4">

                <div className="card border-0 shadow-sm h-100">

                    <div className="card-body">

                        <h5 className="fw-bold mb-3">

                            <i className="bi bi-pc-display me-2"></i>

                            Equipos

                        </h5>


                        <div className="d-flex justify-content-between mb-2">

                            <span className="text-muted">
                                Total registrados
                            </span>

                            <strong>
                                {equipos.length}
                            </strong>

                        </div>


                        <div className="d-flex justify-content-between">

                            <span className="text-muted">
                                Con categoría
                            </span>

                            <strong className="text-success">
                                {equiposConCategoria}
                            </strong>

                        </div>


                        <div className="d-flex justify-content-between mt-2">

                            <span className="text-muted">
                                Sin categoría
                            </span>

                            <strong className="text-secondary">
                                {equiposSinCategoria}
                            </strong>

                        </div>

                    </div>

                </div>

            </div>


            {/* CATEGORÍA PRINCIPAL */}

            <div className="col-md-4">

                <div className="card border-0 shadow-sm h-100">

                    <div className="card-body">

                        <h5 className="fw-bold mb-3">

                            <i className="bi bi-bar-chart me-2"></i>

                            Categoría con más equipos

                        </h5>


                        {categoriaPrincipal ? (

                            <>

                                <h4 className="fw-bold">

                                    {categoriaPrincipal.nombre}

                                </h4>


                                <p className="text-muted mb-0">

                                    Tiene{" "}

                                    <strong>
                                        {cantidadCategoriaPrincipal}
                                    </strong>{" "}

                                    equipos registrados.

                                </p>

                            </>

                        ) : (

                            <p className="text-muted mb-0">

                                No hay categorías registradas.

                            </p>

                        )}

                    </div>

                </div>

            </div>


            {/* ADMINISTRADORES */}

            <div className="col-md-4">

                <div className="card border-0 shadow-sm h-100">

                    <div className="card-body">

                        <h5 className="fw-bold mb-3">

                            <i className="bi bi-shield-check me-2"></i>

                            Usuarios del sistema

                        </h5>


                        <div className="d-flex justify-content-between mb-2">

                            <span className="text-muted">
                                Administradores
                            </span>

                            <strong className="text-primary">
                                {administradores.length}
                            </strong>

                        </div>


                        <div className="d-flex justify-content-between">

                            <span className="text-muted">
                                Empleados
                            </span>

                            <strong>

                                {
                                    usuarios.filter(
                                        (usuario) =>
                                            usuario.rol === "Empleado"
                                    ).length
                                }

                            </strong>

                        </div>


                        <div className="d-flex justify-content-between mt-2">

                            <span className="text-muted">
                                Total
                            </span>

                            <strong>
                                {usuarios.length}
                            </strong>

                        </div>

                    </div>

                </div>

            </div>


        </div>


        {/* ==========================================
            EQUIPOS POR CATEGORÍA
        ========================================== */}

        <div className="card border-0 shadow-sm mt-4">

            <div className="card-body">

                <div className="d-flex justify-content-between align-items-center mb-4">

                    <div>

                        <h5 className="fw-bold mb-1">

                            <i className="bi bi-folder2-open me-2"></i>

                            Equipos por categoría

                        </h5>

                        <p className="text-muted mb-0">

                            Distribución de los equipos registrados

                        </p>

                    </div>


                    <span className="badge bg-primary fs-6">

                        {categorias.length} categorías

                    </span>

                </div>


                {categorias.length === 0 ? (

                    <div className="text-center py-4">

                        <i
                            className="bi bi-folder-x text-muted"
                            style={{
                                fontSize: "50px"
                            }}
                        ></i>

                        <p className="text-muted mt-3 mb-0">

                            No hay categorías registradas.

                        </p>

                    </div>

                ) : (

                    <div className="row g-3">

                        {categorias.map(
                            (categoria) => {

                                const cantidad =
                                    contarEquiposPorCategoria(
                                        categoria
                                    );

                                const porcentaje =
                                    equipos.length > 0
                                        ? Math.round(
                                            (
                                                cantidad /
                                                equipos.length
                                            ) *
                                            100
                                        )
                                        : 0;


                                return (

                                    <div
                                        className="col-md-6 col-lg-4"
                                        key={categoria.id}
                                    >

                                        <div className="border rounded p-3 h-100">

                                            <div className="d-flex justify-content-between align-items-center mb-2">

                                                <div>

                                                    <h6 className="fw-bold mb-1">

                                                        <i className="bi bi-folder me-2"></i>

                                                        {categoria.nombre}

                                                    </h6>

                                                </div>


                                                <span className="badge bg-primary">

                                                    {cantidad}

                                                </span>

                                            </div>


                                            <div className="progress">

                                                <div

                                                    className="progress-bar"

                                                    role="progressbar"

                                                    style={{
                                                        width:
                                                            `${porcentaje}%`
                                                    }}

                                                >

                                                    {porcentaje}%

                                                </div>

                                            </div>

                                        </div>

                                    </div>

                                );

                            }
                        )}

                    </div>

                )}

            </div>

        </div>


        {/* ==========================================
            MENSAJE INFORMATIVO
        ========================================== */}

        <div className="card border-0 shadow-sm mt-4">

            <div className="card-body">

                <h5 className="fw-bold">

    <i className="bi bi-info-circle me-2"></i>

    TecnoNova S.R.L.

</h5>

                <p className="text-muted mb-0">

                    Desde este sistema puede administrar
                    equipos, categorías y usuarios
                    de la institución.

                </p>

            </div>

        </div>


    </div>

);

}

export default Dashboard;