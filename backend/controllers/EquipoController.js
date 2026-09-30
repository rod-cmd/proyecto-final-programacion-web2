const Equipo = require("../models/Equipo");

const listarEquipos = async (req, res) => {
    try {
        const equipos = await Equipo.findAll();

        res.json(equipos);
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener los equipos",
            error: error.message
        });
    }
};

const crearEquipo = async (req, res) => {
    try {
        const {
            nombre,
            marca,
            modelo,
            numeroSerie,
            descripcion,
            precio,
            stock,
            estado,
            categoriaId
        } = req.body;

        if (!nombre || !marca || !categoriaId) {
            return res.status(400).json({
                mensaje: "Nombre, marca y categoría son obligatorios"
            });
        }

        if (precio <= 0) {
            return res.status(400).json({
                mensaje: "El precio debe ser mayor a 0"
            });
        }

        if (stock < 0) {
            return res.status(400).json({
                mensaje: "El stock no puede ser negativo"
            });
        }

        const nuevoEquipo = await Equipo.create({
            nombre,
            marca,
            modelo,
            numeroSerie,
            descripcion,
            precio,
            stock,
            estado,
            categoriaId
        });

        res.status(201).json({
            mensaje: "Equipo registrado correctamente",
            equipo: nuevoEquipo
        });

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al registrar el equipo",
            error: error.message
        });
    }
};

const actualizarEquipo = async (req, res) => {
    try {
        const { id } = req.params;

        const equipo = await Equipo.findByPk(id);

        if (!equipo) {
            return res.status(404).json({
                mensaje: "Equipo no encontrado"
            });
        }

        const {
            nombre,
            marca,
            modelo,
            numeroSerie,
            descripcion,
            precio,
            stock,
            estado,
            categoriaId
        } = req.body;

        if (!nombre || !marca || !categoriaId) {
            return res.status(400).json({
                mensaje: "Nombre, marca y categoría son obligatorios"
            });
        }

        if (precio <= 0) {
            return res.status(400).json({
                mensaje: "El precio debe ser mayor a 0"
            });
        }

        if (stock < 0) {
            return res.status(400).json({
                mensaje: "El stock no puede ser negativo"
            });
        }

        await equipo.update({
            nombre,
            marca,
            modelo,
            numeroSerie,
            descripcion,
            precio,
            stock,
            estado,
            categoriaId
        });

        res.json({
            mensaje: "Equipo actualizado correctamente",
            equipo: equipo
        });

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al actualizar el equipo",
            error: error.message
        });
    }
};

const eliminarEquipo = async (req, res) => {
    try {
        const { id } = req.params;

        const equipo = await Equipo.findByPk(id);

        if (!equipo) {
            return res.status(404).json({
                mensaje: "Equipo no encontrado"
            });
        }

        await equipo.destroy();

        res.json({
            mensaje: "Equipo eliminado correctamente"
        });

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al eliminar el equipo",
            error: error.message
        });
    }
};

module.exports = {
    listarEquipos,
    crearEquipo,
    actualizarEquipo,
    eliminarEquipo
};