import db from "../config/database.js";
import { INTEGER, Sequelize } from "sequelize";
import barang from "./barangModel.js";
import transaksiModel from "./transaksiModel.js";

const cartModel = db.define(
    "cart",
    {
        qty: {
            type: INTEGER,
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

transaksiModel.hasMany(cartModel);
cartModel.belongsTo(barang, { foreignKey: "barangId" });
cartModel.belongsTo(transaksiModel, { foreignKey: "transaksiId" });

export default cartModel;
