const Categoria = require("../models/Categoria");

const listarCategorias = async (req, res) => {
    try {
        const categorias = await Categoria.findAll();

        res.json(categorias);

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener las categorías",
            error: error.message
        });
    }
};

const crearCategoria = async (req, res) => {
    try {
        const { nombre, descripcion, estado } = req.body;

        if (!nombre) {
            return res.status(400).json({
                mensaje: "El nombre de la categoría es obligatorio"
            });
        }

        const nuevaCategoria = await Categoria.create({
            nombre,
            descripcion,
            estado
        });

        res.status(201).json({
            mensaje: "Categoría registrada correctamente",
            categoria: nuevaCategoria
        });

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al registrar la categoría",
            error: error.message
        });
    }
};

const actualizarCategoria = async (req, res) => {
    try {
        const { id } = req.params;

        const categoria = await Categoria.findByPk(id);

        if (!categoria) {
            return res.status(404).json({
                mensaje: "Categoría no encontrada"
            });
        }

        const { nombre, descripcion, estado } = req.body;

        if (!nombre) {
            return res.status(400).json({
                mensaje: "El nombre de la categoría es obligatorio"
            });
        }

        await categoria.update({
            nombre,
            descripcion,
            estado
        });

        res.json({
            mensaje: "Categoría actualizada correctamente",
            categoria
        });

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al actualizar la categoría",
            error: error.message
        });
    }
};

const eliminarCategoria = async (req, res) => {
    try {
        const { id } = req.params;

        const categoria = await Categoria.findByPk(id);

        if (!categoria) {
            return res.status(404).json({
                mensaje: "Categoría no encontrada"
            });
        }

        await categoria.destroy();

        res.json({
            mensaje: "Categoría eliminada correctamente"
        });

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al eliminar la categoría",
            error: error.message
        });
    }
};

module.exports = {
    listarCategorias,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria
};