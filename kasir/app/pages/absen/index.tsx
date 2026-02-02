import { DrawerContent } from "@/app/components";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationProp, RouteProp } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MenuDrawer from "react-native-side-drawer";

interface props {
    navigation: NavigationProp<any, any>;
    route: RouteProp<any, any>;
}

const Absen: React.FC<props> = ({ navigation, route }) => {
    const [open, setOpen] = useState(false);
    const [dataAbsen, setDataAbsen] = useState<
        {
            tanggal: Date;
            jam_masuk: string;
            jam_keluar: string;
            userId: number;
        }[]
    >([]);

    const tgl = new Date();
    const jam = String(tgl.getHours()).padStart(2, "0"); // 00 - 23
    const menit = String(tgl.getMinutes()).padStart(2, "0"); // 00 - 59
    const detik = String(tgl.getSeconds()).padStart(2, "0"); // 00 - 59

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

    const getAbsensUser = async () => {
        const userId = await AsyncStorage.getItem("userId");
        try {
            const response = await fetch(
                `http://192.168.63.12:5000/absen/${userId}`,
            );
            const json = await response.json();
            console.log("DATAABSEN", json);
            setDataAbsen(json);
        } catch (error) {
            console.log(error);
        }
    };

    const createAbsen = async () => {
        const userId = await AsyncStorage.getItem("userId");
        try {
            const response = await fetch("http://192.168.63.12:5000/absen", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    jam_masuk: `${jam}:${menit}:${detik}`,
                    tanggal: tgl.toISOString(),
                    userId: userId,
                }),
            });
            const json = await response.json();

            // setIdAbsen(response.data.data.id);
            // localStorage.setItem("absen", "true");
            // localStorage.setItem("idAbsen", response.data.data.id);
            alert("Berhasil absen :)");
            // navigate("/manage-menu");
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getAbsensUser();
    }, []);

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
                <Text style={styles.headTitle}>Absen Karyawan</Text>
            </View>
            {/* ------------ */}

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
                    <Text style={styles.cardTitle}>Detail Absen</Text>

                    <Text style={styles.text}>
                        Email :{" "}
                        <Text style={styles.textBold}>bobi@gmail.com</Text>
                    </Text>
                    <Text style={styles.text}>
                        Divisi : <Text style={styles.textBold}>kasir</Text>
                    </Text>

                    {/* Button */}
                    <View style={styles.buttonRow}>
                        <TouchableOpacity
                            style={styles.btnAbsen}
                            onPress={() => createAbsen()}
                        >
                            <Text style={styles.btnText}>ABSEN</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.btnPulang}>
                            <Text style={styles.btnText}>PULANG</Text>
                        </TouchableOpacity>
                    </View>
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
                    {dataAbsen.map((a, index) => (
                        <View style={styles.tableRow} key={index}>
                            <Text style={[styles.td, { flex: 0.5 }]}>1</Text>
                            <Text style={[styles.td, { flex: 1.5 }]}>
                                {formatTanggal(a.tanggal)}
                            </Text>
                            <Text style={styles.td}>{a.jam_masuk}</Text>
                            <Text style={styles.td}>-</Text>
                        </View>
                    ))}
                </View>
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
    container: {
        flex: 1,
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

export default Absen;
