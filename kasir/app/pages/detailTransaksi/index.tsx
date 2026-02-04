import Button from "@/app/components/moleculs/Button";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { NavigationProp, RouteProp } from "@react-navigation/native";
import * as FileSystem from "expo-file-system";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface props {
    route: RouteProp<any, any>;
    navigation: NavigationProp<any, any>;
}

const DetailTransaksi: React.FC<props> = ({ route, navigation }) => {
    const [id, setId] = useState<number>();
    const [uuid, setUuid] = useState<string>();
    const [date, setDate] = useState(new Date());
    const [cart, setCart] = useState<
        {
            qty: number;
            barangId: number;
            transaksiId: number;
        }[]
    >([]);

    const [totalHarga, setTotalHarga] = useState<number>();
    const [createdAt, setCreatedAt] = useState<string>();
    const [pelanggan, setPelanggan] = useState<string>();
    const [bayar, setBayar] = useState<number>();

    const routeUuid = route.params?.uuid;

    const getTransaksiByUUID = async () => {
        const response = await fetch(
            `http://192.168.63.12:5000/transaksi/${routeUuid}`,
        );
        const dataJson = await response.json();
        setCart(dataJson.carts);
        setUuid(dataJson.uuid);
        setTotalHarga(dataJson.totalHarga);
        setPelanggan(dataJson.namaPelanggan);
        setBayar(dataJson.bayarPelanggan);
        setCreatedAt(dataJson.createdAt);
        setId(dataJson.id);
    };

    const [barang, setBarang] = useState<
        {
            id: number;
            nama: string;
            harga_jual: number;
            stok: number;
        }[]
    >([]);
    // console.log(data);

    const getDataBarang = async () => {
        try {
            const response = await fetch("http://192.168.63.12:5000/barang");
            const barang = await response.json();
            setBarang(barang);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getTransaksiByUUID();
    });

    useEffect(() => {
        getDataBarang();
    }, []);

    const deleteTransaksi = async () => {
        await fetch(`http://192.168.63.12:5000/transaksi/${id}`, {
            method: "DELETE",
        });
        navigation.navigate("history-transaksi");
    };

    // convert tanggal menjadi string
    const dateNow = date.toISOString().split("T")[0];

    // hitungQty nota
    const handleQTyAll = () => {
        const hitungCart = cart.map((a) => a.qty);
        const sum = hitungCart.reduce((acc, curr) => {
            return acc + curr;
        }, 0);

        return sum;
    };

    const handleCetak = () => {
        const rows = cart
            .map(
                (item, index) => `
            <div>Barang : ${
                barang.find((e) => e.id === item.barangId)?.nama
            }<br>${item.qty} x ${
                barang.find((e) => e.id === item.barangId)?.harga_jual
            }<span class="right">Rp ${
                item.qty *
                barang.find((e) => e.id === item.barangId)!.harga_jual
            }</span>
            </div>
    `,
            )
            .join("");
        return `
        <html>
        <head>
        <style>
        @page { size: 58mm auto; margin: 0; } body { width: 58mm; font-size: 10px; padding: 5px; font-family: sans-serif; padding: 16px;  }
        .center { text-align: center; }
        .bold { font-weight: bold; }
        .line { border-top: 1px dashed #000; margin: 10px 0; }
        .right { text-align: right; }
        .row { display: flex; justify-content: space-between; }
        </style>
        </head>
        <body>
        <div class="center">
        <h3>Tirta Laksana Jaya Murni</h3>
        <p>Jl. Raya Curug Pangkah <br>Tegal</p>
        <p>No. Telp: 08156667320</p>
        </div>
        <div class="line"></div>
        <div class="row"><span>${dateNow}</span></div>
        <div class="row"><span>Pelanggan: ${pelanggan}</span></div>
        <div>No.xxxx</div>
        <div class="line"></div>
        
        list pesanan
              
            ${rows}
              <div class="line"></div>
              <div class="row"><span>Jumlah barang</span><span>Qty : ${handleQTyAll()}</span></div>
              <div class="row bold"><span>Total</span><span>Rp ${totalHarga?.toLocaleString()}</span></div>
              <div class="row"><span>Bayar (Cash)</span><span>Rp ${bayar?.toLocaleString()}</span></div>
              <div class="row"><span>Kembali</span><span>Rp ${
                  bayar! - totalHarga!
              }</span></div>
        
              <div class="center"><p>Terima kasih telah berbelanja</p></div>
            </body>
          </html>
        `;
    };

    // console.log(cart);

    // console.log(sum);

    const handleSavePdf = async () => {
        const htmlContent = handleCetak();

        const { uri } = await Print.printToFileAsync({
            html: htmlContent,
        });

        const customFileName = `Nota_Toko_Jaya_Makmur_${dateNow}.pdf`;

 

        // buat file target
        const targetFile = new FileSystem.File(
            FileSystem.Paths.document,
            customFileName,
        );

        // cek dulu
        if (await targetFile.exists) {
            await targetFile.delete();
        }

        // file sumber
        const sourceFile = new FileSystem.File(uri);

        // move → harus File object
        await sourceFile.move(targetFile);

        // share pakai uri hasil target
        await Sharing.shareAsync(targetFile.uri);
    };

    //
    // console.log(barangMap);
    // const test = () => {
    //     const barangMap = Object.fromEntries(barang.map((b) => [b.id, b.nama, b.harga]));

    //     cart.map((a) => {
    //         const data = barangMap.
    //     })
    // }

    return (
        <View style={styles.containerTransaksi}>
            <View style={styles.dataTransaksi}>
                <Text>No id : {id}</Text>
                <Text>{createdAt?.split("T")[0]}</Text>
                <Text>Nama pelanggan : {pelanggan}</Text>

                {cart.map((item, index) => (
                    <View key={index} style={styles.containerCart}>
                        <Text>
                            {barang.find((e) => e.id === item.barangId)?.nama}
                        </Text>
                        <Text>
                            {" " + item.qty}x{" "}
                            {
                                barang.find((e) => e.id === item.barangId)
                                    ?.harga_jual
                            }
                        </Text>
                    </View>
                ))}
                <Text style={styles.containerCart}>Total harga : {totalHarga}</Text>
            </View>

            <View style={{alignItems: "center"}}>
                <TouchableOpacity
                    onPress={() => deleteTransaksi()}
                    style={styles.buttonDelete}
                >
                    <Text style={{color: "white"}}>Delete</Text>
                </TouchableOpacity>

                <Button
                    aksi={handleSavePdf}
                    style={styles.buttonDate}
                    simbol={
                        <FontAwesome5 name="print" size={24} color="black" />
                    }
                >
                    Cetak
                </Button>
            </View>
        </View>
    );
};
const styles = StyleSheet.create({
    buttonDate: {
        borderWidth: 1,
        width: 130,
        flexDirection: "row",
        gap: 5,
        marginTop: 20,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 10,
        backgroundColor: "#3177d1",
    },
    containerTransaksi: {
        padding: 10,
        backgroundColor: "white",
        elevation: 8,
        marginTop: 12,
        marginHorizontal: 12,
        borderRadius: 8
    },
    dataTransaksi: {
        alignItems: "center"
    },
    containerCart: {
        alignItems: "center",
        flexDirection: "row",
        borderColor: "#000",
        borderBottomWidth: 2,
        width: 160
    },
    buttonDelete: {
        backgroundColor: "red",
        width: "40%",
        alignItems: "center",
        marginTop: 10,
        marginHorizontal: "auto",
        borderRadius: 20,
    },
});

export default DetailTransaksi;
