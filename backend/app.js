const express = require("express");
const cors = require("cors");
const sequelize = require("./config/database");

const equipoRoutes = require("./routes/EquipoRoutes");
const categoriaRoutes = require("./routes/CategoriaRoutes");
const UsuarioRoutes = require("./routes/UsuarioRoutes")

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", equipoRoutes);
app.use("/api", categoriaRoutes);
app.use("/api", UsuarioRoutes);

app.get("/", (req, res) => {
    res.send("Sistema de Gestión de Equipos Tecnológicos");
});

async function iniciarServidor() {
    try {
        await sequelize.authenticate();

        console.log("Conexión con SQL Server establecida correctamente.");

        await sequelize.sync();

        console.log("Base de datos sincronizada correctamente.");

        app.listen(process.env.PORT, () => {
            console.log(
                `Servidor ejecutándose en http://localhost:${process.env.PORT}`
            );
        });

    } catch (error) {
        console.error("Error al iniciar el servidor:", error.message);
    }
}

iniciarServidor();