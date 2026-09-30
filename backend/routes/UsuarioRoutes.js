const express = require("express");

const router = express.Router();

const UsuarioController = require("../controllers/UsuarioController");


router.post("/login", UsuarioController.iniciarSesion);

router.get("/usuarios", UsuarioController.listarUsuarios);

router.post("/usuarios", UsuarioController.crearUsuario);

router.put("/usuarios/:id", UsuarioController.actualizarUsuario);

router.delete("/usuarios/:id", UsuarioController.eliminarUsuario);


module.exports = router;
