import React, { useEffect, useState } from "react";
import { ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";

import Button from "@/app/components/moleculs/Button";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { NavigationProp, RouteProp } from "@react-navigation/native";
import * as FileSystem from "expo-file-system";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

interface props {
    navigation: NavigationProp<any, any>;
    route: RouteProp<any, any>;
}

const DetailAbsenAdmin: React.FC<props> = ({ navigation, route }) => {
    const [dataAbsen1, setDataAbsen] = useState<
        {
            tanggal: Date;
            jam_masuk: string;
            jam_keluar: string;
            tunai: number;
            userId: number;
        }[]
    >([]);
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");
    const [date, setDate] = useState(new Date());

    const sendData = route.params?.userId;
    console.log("USERID", sendData);

    const formatTanggal = (dateInput: string | Date) => {
        const date =
            dateInput instanceof Date ? dateInput : new Date(dateInput);

        if (isNaN(date.getTime())) return "-";
        const days = [
            "Minggu",
            "Senin",
            "Selasa",
            "Rabu",
            "Kamis",
            "Jum'at",
            "Sabtu",
        ];

        const hari = days[date.getDay()];
        const tgl = String(date.getDate()).padStart(2, "0");
        const bulan = String(date.getMonth() + 1).padStart(2, "0");
        const tahun = date.getFullYear();

        return `${hari}, ${tgl}-${bulan}-${tahun}`;
    };

    const getUser = async () => {
        try {
            const response = await fetch(
                `http://192.168.106.12:5000/user/${sendData}`,
            );
            const data = await response.json();
            console.log(data);
            setEmail(data.email);
            setRole(data.role);
            setDataAbsen(data.absens);
            console.log("ABSENDETAIL", data.absens);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getUser();
    }, []);

    const totalGaji = dataAbsen1.reduce((total, item) => {
        return total + item.tunai;
    }, 0);

    // const getAbsensUser = async () => {
    //     try {
    //         const response = await fetch(
    //             `http://192.168.106.12:5000/absen/${sendData}`,
    //         );
    //         const json = await response.json();
    //         setDataAbsen(json);
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };

    // useEffect(() => {
    //     getAbsensUser();
    // }, []);

    const generateHTML = () => {
        const rows = dataAbsen1
            .map(
                (item, index) => `
          <tr>
            <td>${index + 1}</td>
            <td>${formatTanggal(item.tanggal)}</td>
            <td>${item.jam_masuk}</td>
            <td>${item.jam_keluar}</td>
            <td>Rp  ${item.tunai.toLocaleString()}</td>
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
    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Payfazz_logo.svg/2560px-Payfazz_logo.svg.png" alt="jayaMakmur" height="50"><br>
    <h1>Laporan Pengganjian ${date.toISOString().split("T")[0]}</h1>
    <p><strong>Toko Sembako Jaya Makmur</strong><br>0878950244</p>
  </div>

  <table>
    <thead>
      <tr>
        <th>No</th>
        <th>Tanggal</th>
        <th>Jam Masuk</th>
        <th>Jam Keluar</th>
        <th>Tunai</th>
      </tr>
    </thead>
    <tbody>
      ${rows}
      <tr id="total">Email : ${email}</tr> </br>
      <tr id="total">Role : ${role}</tr> </br>
      <tr id="total">Total Gaji : Rp.${totalGaji.toLocaleString()}</tr>
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

        const customFileName = `Toko_Sembako_Jaya_Makmur_${date.toISOString().split("T")[0]}.pdf`;

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

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#FF9B51" barStyle="light-content" />

            <View style={styles.headInfo}>
                <Text
                    style={{ fontSize: 26, fontWeight: "700", color: "white" }}
                >
                    Detail Absen
                </Text>
                <Text
                    style={{
                        borderBottomWidth: 2,
                        height: 0,
                        width: "70%",
                        borderColor: "white",
                    }}
                ></Text>
            </View>

            {/* menampilkan absen */}
            <ScrollView
                contentContainerStyle={{
                    paddingBottom: 40,
                    paddingHorizontal: 16,
                }}
            >
                {/* Judul */}
                <Text style={styles.title}>Absensi</Text>

                {/* Card Detail Absen */}
                <View style={styles.card}>
                    <Text style={styles.text}>
                        Email : <Text style={styles.textBold}>{email}</Text>
                    </Text>
                    <Text style={styles.text}>
                        Divisi : <Text style={styles.textBold}>{role}</Text>
                    </Text>
                </View>

                <Button
                    aksi={handleSavePdf}
                    style={styles.buttonDate}
                    simbol={
                        <FontAwesome5 name="print" size={24} color="black" />
                    }
                >
                    Cetak
                </Button>

                {/* Tabel Absensi */}
                <View style={styles.table}>
                    {/* Header */}
                    <View style={styles.tableHeader}>
                        <Text style={[styles.th, { flex: 0.5 }]}>No</Text>
                        <Text style={[styles.th, { flex: 1.5 }]}>Tanggal</Text>
                        <Text style={styles.th}>Jam Masuk</Text>
                        <Text style={styles.th}>Jam Keluar</Text>
                    </View>

                    {/* Row */}
                    {dataAbsen1.map((a, index) => (
                        <View style={styles.tableRow} key={index}>
                            <Text style={[styles.td, { flex: 0.5 }]}>
                                {index + 1}
                            </Text>
                            <Text style={[styles.td, { flex: 1.5 }]}>
                                {formatTanggal(a.tanggal)}
                            </Text>
                            <Text style={styles.td}>{a.jam_masuk}</Text>
                            <Text style={styles.td}>{a.jam_keluar}</Text>
                        </View>
                    ))}

                    <Text style={styles.th}>
                        Total Gaji: Rp.{totalGaji.toLocaleString()}
                    </Text>
                </View>
            </ScrollView>
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
        backgroundColor: "#819067",
    },
    headInfo: {
        borderRadius: 15,
        padding: 5,
        paddingHorizontal: 10,
        paddingBottom: 19,
        backgroundColor: "#FF9B51",
        gap: 8,
        marginBottom: 30,
        alignItems: "center",
    },
    textNav: {
        fontSize: 25,
        fontWeight: "bold",
    },
    navbar: {
        padding: 7,
        marginBottom: 40,
        backgroundColor: "#FF9B51",
    },
    container: {
        flex: 1,
    },
    button: {
        backgroundColor: "#4A9782",
        padding: 8,
        alignItems: "center",
        borderRadius: 9,
        marginBottom: 10,
    },
    button2: {
        backgroundColor: "blue",
        padding: 8,
        alignItems: "center",
        borderRadius: 9,
        marginBottom: 10,
    },
    buttonTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "white",
    },
    topBar: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginBottom: 30,
    },
    contentCon: {
        width: 400,
        borderWidth: 2,
        marginHorizontal: "auto",
        borderRadius: 2,
    },
    containerRank: {
        flex: 1,
    },
    headRank: {
        alignItems: "center",
        marginBottom: 20,
        backgroundColor: "#edeae4",
        paddingVertical: 3,
        elevation: 2,
    },
    textHead: {
        fontSize: 20,
        fontWeight: "bold",
    },
    mainRank: {
        flexDirection: "row",
        justifyContent: "space-around",
        borderBottomWidth: 2,
        borderColor: "#edebe8",
        paddingBottom: 5,
    },
    textRank: {
        textAlign: "left",
        width: 90,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        marginVertical: 16,
    },

    /* Card */
    card: {
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 16,
        elevation: 3,
        marginBottom: 20,
    },

    cardTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 8,
    },

    text: {
        fontSize: 14,
        marginBottom: 4,
    },

    textBold: {
        fontWeight: "bold",
    },

    buttonRow: {
        flexDirection: "row",
        marginTop: 12,
    },
    buttonRowHidden: {
        display: "none",
    },

    btnAbsen: {
        backgroundColor: "#0BB54A",
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 6,
        marginRight: 10,
    },

    btnPulang: {
        backgroundColor: "#E53935",
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 6,
    },

    btnText: {
        color: "#fff",
        fontWeight: "bold",
    },

    /* Table */
    table: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        overflow: "hidden",
    },

    tableHeader: {
        flexDirection: "row",
        backgroundColor: "#F1F1F1",
        paddingVertical: 8,
    },

    th: {
        flex: 1,
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 13,
    },

    tableRow: {
        flexDirection: "row",
        backgroundColor: "#2C3E50",
        paddingVertical: 10,
    },

    td: {
        flex: 1,
        color: "#fff",
        textAlign: "center",
        fontSize: 13,
    },
});
export default DetailAbsenAdmin;
