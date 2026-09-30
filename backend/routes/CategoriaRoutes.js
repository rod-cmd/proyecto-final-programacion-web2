const express = require("express");
const router = express.Router();

const CategoriaController = require("../controllers/CategoriaController");

router.get("/categorias", CategoriaController.listarCategorias);
router.post("/categorias", CategoriaController.crearCategoria);
router.put("/categorias/:id", CategoriaController.actualizarCategoria);
router.delete("/categorias/:id", CategoriaController.eliminarCategoria);

module.exports = router;