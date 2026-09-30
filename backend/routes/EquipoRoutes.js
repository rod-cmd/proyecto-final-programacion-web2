const express = require("express");
const router = express.Router();

const EquipoController = require("../controllers/EquipoController");

router.get("/equipos", EquipoController.listarEquipos);
router.post("/equipos", EquipoController.crearEquipo);
router.put("/equipos/:id", EquipoController.actualizarEquipo);
router.delete("/equipos/:id", EquipoController.eliminarEquipo);

module.exports = router;