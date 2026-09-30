const Usuario = require("../models/Usuario");


// INICIAR SESIÓN
const iniciarSesion = async (req, res) => {

    try {

        const { usuario, password } = req.body;

        if (!usuario || !password) {

            return res.status(400).json({
                mensaje: "Usuario y contraseña son obligatorios"
            });
        }

        const usuarioEncontrado = await Usuario.findOne({
            where: {
                usuario,
                password,
                estado: true
            }
        });

        if (!usuarioEncontrado) {

            return res.status(401).json({
                mensaje: "Usuario o contraseña incorrectos"
            });

        }

        res.json({
            mensaje: "Inicio de sesión correcto",
            usuario: {
                id: usuarioEncontrado.id,
                nombre: usuarioEncontrado.nombre,
                usuario: usuarioEncontrado.usuario,
                rol: usuarioEncontrado.rol
            }
        });

    } catch (error) {

        res.status(500).json({
            mensaje: "Error al iniciar sesión",
            error: error.message
        });

    }
};


// LISTAR USUARIOS
const listarUsuarios = async (req, res) => {

    try {

        const usuarios = await Usuario.findAll({
            attributes: [
                "id",
                "nombre",
                "usuario",
                "rol",
                "estado"
            ]
        });

        res.json(usuarios);

    } catch (error) {

        res.status(500).json({
            mensaje: "Error al obtener usuarios",
            error: error.message
        });

    }
};


// CREAR USUARIO
const crearUsuario = async (req, res) => {

    try {

        const {
            nombre,
            usuario,
            password,
            rol
        } = req.body;


        if (!nombre || !usuario || !password || !rol) {

            return res.status(400).json({
                mensaje: "Todos los campos son obligatorios"
            });

        }


        const usuarioExistente = await Usuario.findOne({
            where: { usuario }
        });


        if (usuarioExistente) {

            return res.status(400).json({
                mensaje: "El nombre de usuario ya existe"
            });

        }


        const nuevoUsuario = await Usuario.create({
            nombre,
            usuario,
            password,
            rol,
            estado: true
        });


        res.status(201).json({
            mensaje: "Usuario registrado correctamente",
            usuario: nuevoUsuario
        });


    } catch (error) {

        res.status(500).json({
            mensaje: "Error al registrar usuario",
            error: error.message
        });

    }
};


// ACTUALIZAR USUARIO
const actualizarUsuario = async (req, res) => {

    try {

        const { id } = req.params;

        const {
            nombre,
            usuario,
            password,
            rol,
            estado
        } = req.body;


        const usuarioEncontrado = await Usuario.findByPk(id);


        if (!usuarioEncontrado) {

            return res.status(404).json({
                mensaje: "Usuario no encontrado"
            });

        }


        if (!nombre || !usuario || !rol) {

            return res.status(400).json({
                mensaje: "Nombre, usuario y rol son obligatorios"
            });

        }


        usuarioEncontrado.nombre = nombre;
        usuarioEncontrado.usuario = usuario;
        usuarioEncontrado.rol = rol;
        usuarioEncontrado.estado = estado;


        if (password) {
            usuarioEncontrado.password = password;
        }


        await usuarioEncontrado.save();


        res.json({
            mensaje: "Usuario actualizado correctamente",
            usuario: usuarioEncontrado
        });


    } catch (error) {

        res.status(500).json({
            mensaje: "Error al actualizar usuario",
            error: error.message
        });

    }
};


// ELIMINAR USUARIO
const eliminarUsuario = async (req, res) => {

    try {

        const { id } = req.params;

        const usuarioEncontrado = await Usuario.findByPk(id);


        if (!usuarioEncontrado) {

            return res.status(404).json({
                mensaje: "Usuario no encontrado"
            });

        }


        await usuarioEncontrado.destroy();


        res.json({
            mensaje: "Usuario eliminado correctamente"
        });


    } catch (error) {

        res.status(500).json({
            mensaje: "Error al eliminar usuario",
            error: error.message
        });

    }
};


module.exports = {
    iniciarSesion,
    listarUsuarios,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario
};