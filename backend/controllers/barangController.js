import { Sequelize, where } from "sequelize";
import barang from "../models/barangModel.js";

export const createBarang = async (req, res) => {
    const { nama, harga_jual, harga_beli, stok } = req.body;

    try {
        await barang.create({
            nama,
            harga_jual,
            harga_beli,
            stok,
        });
        res.status(200).json({ msg: "Barang berhasil ditambahkan1" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

export const updateBarangById = async (req, res) => {
    try {
        const { nama, harga_jual, harga_beli, stok } = req.body;
        await barang.update(
            {
                nama,
                harga_jual,
                harga_beli,
                stok,
            },
            {
                where: {
                    id: req.params.id,
                },
            }
        );
        res.status(200).json({ msg: "Data berhasil dirubah" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

export const getBarang = async (req, res) => {
    try {
        const response = await barang.findAll({
            attributes: ["id", "nama", "harga_jual", "harga_beli", "stok"],
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

export const getBarangById = async (req, res) => {
    try {
        const response = await barang.findOne({
            where: {
                id: req.params.id,
            },
        });

        if (!response) res.status(400).json({ msg: "Data tidak tersedia!" });

        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

export const deleteBarangById = async (req, res) => {
    try {
        await barang.destroy({
            where: {
                id: req.params.id,
            },
        });
        res.status(200).json({ msg: "Data berhasil dihapus!" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};
