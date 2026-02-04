import React, { useEffect, useState } from "react";
import { ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";

import { NavigationProp, RouteProp } from "@react-navigation/native";

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
                `http://192.168.63.12:5000/user/${sendData}`,
            );
            const data = await response.json();
            console.log(data);
            setEmail(data.email);
            setRole(data.role);
            setDataAbsen(data.absens);
            console.log("ABSENDETAIL",data.absens);
            
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

    console.log("TOTALGAJI",totalGaji);
    

    // const getAbsensUser = async () => {
    //     try {
    //         const response = await fetch(
    //             `http://192.168.63.12:5000/absen/${sendData}`,
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

                    <Text style={styles.th}>Total Gaji: Rp.{totalGaji.toLocaleString()}</Text>
                </View>
            </ScrollView>
        </View>
    );
};
const styles = StyleSheet.create({
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
