import { DrawerContent } from "@/app/components";
import Button from "@/app/components/moleculs/Button";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Ionicons from "@expo/vector-icons/Ionicons";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { NavigationProp } from "@react-navigation/native";
import * as FileSystem from "expo-file-system";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MenuDrawer from "react-native-side-drawer";

interface props {
    navigation: NavigationProp<any, any>;
}

const Laporan: React.FC<props> = ({ navigation }) => {
    const [open, setOpen] = useState(false);

    const [barang, setBarang] = useState<
        {
            id: number;
            nama: string;
            harga_beli: number;
            harga_jual: number;
            stok: number;
        }[]
    >([]);

    const [cart, setCart] = useState<
        {
            barangId: number;
            createdAt: string;
            qty: number;
            transaksiId: number;
        }[]
    >([]);
    const [date, setDate] = useState(new Date());
    const [date2, setDate2] = useState(new Date());

    const [dataLaporan, setDataLaporan] = useState<
        {
            tanggal: string;
            barang: string;
            qty: number;
            harga: number;
            total_Penjualan: number;
        }[]
    >([]);

    const toggleOpen = () => {
        if (open === false) {
            setOpen(true);
        } else {
            setOpen(false);
        }
    };

    const sideBarContent = () => {
        return (
            <DrawerContent
                toggleOpen={toggleOpen}
                onPress1={() => navigation.navigate("kasir")}
                onPress2={() => navigation.navigate("manage-barang")}
                onPress3={() => navigation.navigate("history-transaksi")}
                onPress4={() => navigation.navigate("login")}
                onPress5={() => navigation.navigate("laporan")}
            />
        );
    };

    // convert tanggal menjadi string
    const dateNow = date.toISOString().split("T")[0];

    const onChange1 = (event: any, selectedDate: any) => {
        const currentDate = selectedDate || date;
        setDate(currentDate);
    };

    const onChange2 = (event: any, selectedDate2: any) => {
        const currentDate2 = selectedDate2 || date2;
        setDate2(currentDate2);
    };

    const getCart = async () => {
        try {
            const response = await fetch("http://192.168.63.12:5000/cart");
            const cat = await response.json();
            setCart(cat.response);
        } catch (error) {
            console.log(error);
        }
    };

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
        getCart();
    }, []);

    useEffect(() => {
        getDataBarang();
    }, []);

    // Penting ----------------
    // Buat map untuk mempermudah pencarian nama berdasarkan barangId
    const barangMap = Object.fromEntries(barang.map((b) => [b.id, b.nama]));

    // Ubah barangId menjadi nama
    const cartDenganNama = cart.map((item) => ({
        createdAt: item.createdAt.split("T")[0],
        qty: item.qty,
        transaksiId: item.transaksiId,
        nama_barang: barangMap[item.barangId],
    }));

    const grouped1 = new Map();

    for (const item of cartDenganNama) {
        const key = `${item.createdAt}_${item.nama_barang}`;

        if (grouped1.has(key)) {
            grouped1.get(key).qty += item.qty;
        } else {
            grouped1.set(key, {
                createdAt: item.createdAt,
                nama_barang: item.nama_barang,
                qty: item.qty,
            });
        }
    }

    const hasilGabungan = Array.from(grouped1.values());

    // Buat map nama_barang => data barang
    const barangMap2 = Object.fromEntries(barang.map((b) => [b.nama, b]));

    // Tambahkan harga ke setiap item transaksi
    const transaksiDenganHarga = hasilGabungan.map((item) => {
        const barangInfo = barangMap2[item.nama_barang] || {};
        return {
            ...item,
            harga_jual: barangInfo.harga_jual || 0,
        };
    });

    // Range tanggal yang dipilih
    const startDate = new Date(date.toISOString().split("T")[0]);
    const endDate = new Date(date2.toISOString().split("T")[0]);

    // // Filter berdasarkan range
    const filteredData = transaksiDenganHarga.filter((item) => {
        const tgl = new Date(item.createdAt);
        return tgl >= startDate && tgl <= endDate;
    });

    const totalPenjualan2 = filteredData.reduce((total, item) => {
        return total + item.harga_jual * item.qty;
    }, 0);

    console.log(filteredData);
    // ************

    const generateHTML = () => {
        const rows = filteredData
            .map(
                (item, index) => `
          <tr>
            <td>${index + 1}</td>
            <td>${item.createdAt}</td>
            <td>${item.nama_barang}</td>
            <td>${item.qty}</td>
            <td>Rp  ${item.harga_jual.toLocaleString()}</td>
            <td>Rp  ${item.harga_jual * item.qty}</td>
          </tr>
        `,
            )
            .join("");
        return `
          <html>
            <head>
  <meta charset="UTF-8">
  <title>Laporan Pencatatan - September 2020</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 30px;
    }
    h1, h2 {
      text-align: center;
    }
    .header {
      text-align: center;
      margin-bottom: 20px;
    }
    .summary {
      display: flex;
      justify-content: center;
      margin-bottom: 20px;
      gap: 40px;
      font-size: 18px;
    }
    .summary div {
      padding: 10px;
      border-radius: 5px;
      font-weight: bold;
    }
    .green { color: green; }
    .red { color: red; }
    .blue { color: #007bff; }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 30px;
    }
    th, td {
      border: 1px solid #ccc;
      padding: 8px;
      text-align: center;
    }
    th {
      background-color: #f4f4f4;
    }
    .footer {
      text-align: right;
      font-size: 14px;
    }
      tr#total {
  font-size: 18px;
  font-weight: bold;
}
  </style>
</head>
<body>

  <div class="header">
    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Payfazz_logo.svg/2560px-Payfazz_logo.svg.png" alt="bengkel Logo" height="50"><br>
    <h1>Laporan Pendataan Penjualan ${date.toISOString().split("T")[0]} - ${
        date2.toISOString().split("T")[0]
    }</h1>
    <p><strong>Toko Sembako Jaya Makmur</strong><br>0878959322</p>
  </div>

  <table>
    <thead>
      <tr>
        <th>No</th>
        <th>Tanggal</th>
        <th>Nama</th>
        <th>Qty</th>
        <th>Harga</th>
        <th>Total Penjualan</th>
      </tr>
    </thead>
    <tbody>
      ${rows}
      <tr id="total">Total keseluruhan penjualan : ${totalPenjualan2}</tr>
    </tbody>
  </table>

</body>
          </html>
        `;
    };

    const handleSavePdf = async () => {
        const htmlContent = generateHTML();

        const { uri } = await Print.printToFileAsync({
            html: htmlContent,
        });

        const customFileName = `Laporan_Toko_Jaya_Makmur_${dateNow}.pdf`;

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

    // ------------------------------------------------------------
    const showDatepicker = () => {
        DateTimePickerAndroid.open({
            value: date,
            onChange: onChange1,
            mode: "date",
            is24Hour: true,
        });
    };

    const showDatepicker2 = () => {
        DateTimePickerAndroid.open({
            value: date2,
            onChange: onChange2,
            mode: "date",
            is24Hour: true,
        });
    };

    // console.log("tgl1", date);
    // console.log("tgl2", date2);

    return (
        <SafeAreaView style={styles.container}>
            {/* bagian atas aplikasi kasir */}
            <View style={styles.headContainer}>
                <Ionicons
                    name="menu"
                    size={30}
                    color="white"
                    onPress={() => toggleOpen()}
                />
                <Text style={styles.headTitle}>Laporan Penjualan</Text>
            </View>
            {/* ------------ */}

            {/* menampilkan daftar menu */}
            <ScrollView style={{ paddingHorizontal: 8 }}>
                <View
                    style={{
                        paddingLeft: 25,
                        paddingVertical: 15,
                    }}
                >
                    <Text style={{ fontSize: 20, fontWeight: "900" }}>
                        Toko Sembako Jaya Makmur
                    </Text>
                    <Text style={{ borderBottomWidth: 2, height: 2 }}></Text>
                    <Text style={{ fontSize: 15, fontWeight: "light" }}>
                        Filter data berdasarkan tanggal yang dibutuhkan
                    </Text>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <Button
                            style={styles.buttonDate}
                            styleTitle={{ color: "white" }}
                            // aksi={showDatepicker}
                            aksi={showDatepicker}
                            simbol={
                                <FontAwesome6
                                    name="newspaper"
                                    size={24}
                                    color="black"
                                />
                            }
                        >
                            {date ? date.toISOString().split("T")[0] : dateNow}
                        </Button>

                        <Text style={{fontSize: 50}}>
                            {">"}
                        </Text>

                        <Button
                            style={styles.buttonDate}
                            styleTitle={{ color: "white" }}
                            // aksi={showDatepicker}
                            aksi={showDatepicker2}
                            simbol={
                                <FontAwesome6
                                    name="newspaper"
                                    size={24}
                                    color="black"
                                />
                            }
                        >
                            {date2
                                ? date2.toISOString().split("T")[0]
                                : dateNow}
                        </Button>
                    </View>
                    <Button
                        aksi={handleSavePdf}
                        style={styles.buttonDate}
                        simbol={
                            <FontAwesome5
                                name="print"
                                size={24}
                                color="black"
                            />
                        }
                    >
                        Cetak
                    </Button>
                </View>
                {/* menu bagian */}
                <ScrollView
                    horizontal
                    style={{
                        backgroundColor: "#FDFFB8",
                    }}
                >
                    <View style={styles.container}>
                        {/* Header */}
                        <View style={[styles.row, styles.header]}>
                            <Text style={{ width: 50 }}>No</Text>
                            <Text
                                style={[
                                    styles.cell,
                                    styles.headerText,
                                    { flex: 2 },
                                ]}
                            >
                                Tanggal
                            </Text>
                            <Text style={[styles.cell, styles.headerText]}>
                                barang
                            </Text>
                            <Text style={[styles.cell, styles.headerText]}>
                                qty
                            </Text>
                            <Text style={[styles.cell, styles.headerText]}>
                                harga
                            </Text>
                            <Text style={[styles.cell, styles.headerText]}>
                                total penjualan
                            </Text>
                        </View>

                        {/* Data Rows */}

                        {filteredData.map((item, index) => {
                            return (
                                <View key={index} style={styles.row}>
                                    <Text style={{ width: 50 }}>
                                        {index + 1}
                                    </Text>
                                    <Text style={[styles.cell, { flex: 2 }]}>
                                        {item.createdAt}
                                    </Text>
                                    <Text style={[styles.cell, styles.green]}>
                                        {item.nama_barang}
                                    </Text>
                                    <Text style={[styles.cell, styles.red]}>
                                        {item.qty}
                                    </Text>
                                    <Text style={styles.cell}>
                                        {item.harga_jual}
                                    </Text>
                                    <Text style={styles.cell}>
                                        {item.harga_jual * item.qty}
                                    </Text>
                                </View>
                            );
                        })}
                        <Text style={{ fontSize: 15, fontWeight: "700" }}>
                            Total Penjualan keseluruhan : {totalPenjualan2}
                        </Text>
                    </View>
                </ScrollView>
                {/* ------------ */}
            </ScrollView>

            {/* ---------- */}
            <MenuDrawer
                open={open}
                position={"left"}
                drawerContent={sideBarContent()}
                drawerPercentage={70}
                animationTime={250}
                overlay={true}
                opacity={0.4}
            ></MenuDrawer>
        </SafeAreaView>
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
        backgroundColor: "#819067",
    },
    container: {
        padding: 10,
        minWidth: 700,
    },
    row: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderColor: "#ccc",
        paddingVertical: 6,
    },
    header: {
        backgroundColor: "#f0f0f0",
        borderBottomWidth: 2,
    },
    headerText: {
        fontWeight: "bold",
    },
    cell: {
        flex: 1,
        // paddingHorizontal: 6,
        // paddingRight : 20,
        width: 110,
        borderRightWidth: 0.5,
        paddingLeft: 10,
    },
    green: {
        color: "green",
    },
    red: {
        color: "red",
    },
    animatedBox: {
        flex: 1,
        backgroundColor: "#38C8EC",
        padding: 10,
    },
    sidebarHead: {
        flexDirection: "row",
        borderWidth: 2,
        justifyContent: "space-between",
    },
    sidebarTitle: {
        fontSize: 17,
        fontWeight: "700",
    },
    sidebarMain: {
        borderWidth: 2,
        flexDirection: "column",
        justifyContent: "space-between",
        height: "50%",
        marginTop: 20,
    },
    sidebarMenu: {
        fontSize: 20,
        fontWeight: "800",
    },
    tutupSidebar: {
        flexDirection: "row",
        alignItems: "center",
    },
    container: {
        flex: 1,
    },
    headContainer: {
        flexDirection: "row",
        position: "relative",
        paddingVertical: 10,
        paddingHorizontal: 5,
        backgroundColor: "#FF9B51",
    },
    headTitle: {
        fontSize: 20,
        marginLeft: 30,
        color: "white",
    },
    containerSearch: {
        flexDirection: "row",
        borderWidth: 3,
        alignItems: "center",
    },
    containerBarang: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
        backgroundColor: "#FFF085",
        padding: 5,
        paddingVertical: 15,
    },
    barisInfo: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    barisInfo2: {
        alignItems: "flex-end",
        flexDirection: "column",
        gap: 15,
    },
});

export default Laporan;
