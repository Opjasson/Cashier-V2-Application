import { DATE, INTEGER, NUMBER, STRING } from "sequelize";
import db from "../config/database.js";
import userModel from "./user.js";


const absenModel = db.define(
    "absen",
    {
        jam_masuk: {
            type: STRING,
            allowNull: true,
            validate: {
                notEmpty: false,
            },
        },
        jam_keluar: {
            type: STRING,
            allowNull: true,
            validate: {
                notEmpty: false,
            },
        },
        tanggal: {
            type: DATE,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        tunai: {
            type: INTEGER,
            allowNull: true,
            validate: {
                notEmpty: false,
            },
        },
    },
    {
        freezeTableName: true,
    },
);

userModel.hasMany(absenModel);
absenModel.belongsTo(userModel, {foreignKey: "userId"});

export default absenModel;
