import { where } from "sequelize";
import cartModel from "../models/cartModel.js";
import transaksiModel from "../models/transaksiModel.js";

export const addTransaksi = async (req, res) => {
    try {
        const response = await transaksiModel.create();
        res.status(200).json({ response });
    } catch (error) {
        req.status(400).json({ msg: error.message });
    }
};

export const getAllTransaksi = async (req, res) => {
    try {
        const response = await transaksiModel.findAll({
            attributes: ["id", "uuid", "totalHarga", "namaPelanggan", "bayarPelanggan","createdAt"],
            include: [
                {
                    model: cartModel,
                    attributes: ["barangId", "transaksiId", "qty"],
                },
            ],
        });
        res.status(200).json({ response });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

export const getTransaksiByUuid = async (req, res) => {
    try {
        const response = await transaksiModel.findOne({
            where: {
                uuid: req.params.id,
            },
            include: [
                {
                    model: cartModel,
                    attributes: ["barangId", "transaksiId", "qty"],
                },
            ],
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

export const updateTransaksi = async (req, res) => {
    try {
        const { totalHarga, namaPelanggan, bayarPelanggan } = req.body;
        await transaksiModel.update(
            {
                totalHarga,
                bayarPelanggan,
                namaPelanggan,
            },
            {
                where: {
                    id: req.params.id,
                },
            }
        );
        res.status(200).json({ msg: "Data berhasil dirubah!" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

export const deleteTransaksi = async (req, res) => {
    try {
        await transaksiModel.destroy({
            where: {
                id: req.params.id,
            },
        });
        res.status(200).json({ msg: "Data berhasil dihapus!" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};
