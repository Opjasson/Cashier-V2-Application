import { INTEGER, STRING, UUIDV4 } from "sequelize";
import db from "../config/database.js";
import cartModel from "./cartModel.js";

const transaksiModel = db.define(
    "transaksi",
    {
        uuid: {
            type: STRING,
            defaultValue: UUIDV4,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        namaPelanggan: {
            type: STRING,
            allowNull: true,
            validate: {
                notEmpty: false,
            },
        },
        totalHarga: {
            type: INTEGER,
            defaultValue: 0,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        bayarPelanggan: {
            type: INTEGER,
            defaultValue: 0,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
    },
    {
        freezeTableName: true,
    }
);

export default transaksiModel;
