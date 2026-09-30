import { useState } from "react";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import Equipos from "./components/Equipos";
import Categorias from "./components/Categorias";
import Usuarios from "./components/Usuarios";
import Login from "./components/Login";

function App() {

    const [usuario, setUsuario] = useState(null);
    const [pagina, setPagina] = useState("dashboard");

    const iniciarSesion = (datosUsuario) => {
        setUsuario(datosUsuario);
    };

    const cerrarSesion = () => {
        setUsuario(null);
        setPagina("dashboard");
    };

    if (!usuario) {
        return <Login iniciarSesion={iniciarSesion} />;
    }

    return (
        <div className="d-flex">

            <Sidebar
    cambiarPagina={setPagina}
    usuario={usuario}
/>

            <div className="flex-grow-1">

                <Navbar
    usuario={usuario}
    cerrarSesion={cerrarSesion}
/>

                {pagina === "dashboard" && <Dashboard />}

{pagina === "equipos" && <Equipos />}

{pagina === "categorias" && <Categorias />}

{pagina === "usuarios" && usuario.rol === "Administrador" && (
    <Usuarios />
)}

            </div>

        </div>
    );
}

export default App;