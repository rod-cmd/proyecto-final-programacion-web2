const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Equipo = sequelize.define(
    "Equipo",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        nombre: {
            type: DataTypes.STRING(100),
            allowNull: false
        },

        marca: {
            type: DataTypes.STRING(100),
            allowNull: false
        },

        modelo: {
            type: DataTypes.STRING(100),
            allowNull: true
        },

        numeroSerie: {
            type: DataTypes.STRING(100),
            allowNull: true
        },

        descripcion: {
            type: DataTypes.STRING(255),
            allowNull: true
        },

        precio: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },

        stock: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        estado: {
            type: DataTypes.STRING(30),
            allowNull: false,
            defaultValue: "Disponible"
        },

        categoriaId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
    tableName: "Equipos",
    timestamps: false
}
);

module.exports = Equipo;