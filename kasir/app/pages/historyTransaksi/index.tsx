import { DrawerContent } from "@/app/components";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationProp } from "@react-navigation/native";
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
}

const HistoryTransaksi: React.FC<props> = ({ navigation }) => {
    const [open, setOpen] = useState(false);
    const [historyTransaksi, setHistoryTransaksi] = useState<
        {
            carts: [];
            id: number;
            uuid: string;
            totalHarga: number;
            createdAt: string;
        }[]
    >([]);

    const [barang, setBarang] = useState<
        {
            id: number;
            nama: string;
            harga: number;
            stok: number;
        }[]
    >([]);

    const toggleOpen = () => {
        if (open === false) {
            setOpen(true);
        } else {
            setOpen(false);
        }
    };

     const handleLogout = async () => {
        await AsyncStorage.multiRemove(["userId", "absenId"]);
        navigation.navigate("login");
    };

    // daftar menu sidebar
    const sideBarContent = () => {
        return (
            <DrawerContent
                toggleOpen={toggleOpen}
                onPress1={() => navigation.navigate("kasir")}
                onPress2={() => navigation.navigate("manage-barang")}
                onPress3={() => navigation.navigate("history-transaksi")}
                onPress4={() => handleLogout()}
                onPress5={() => navigation.navigate("laporan")}
                onPress6={() => navigation.navigate("absen")}
            />
        );
    };
    // -------------


    const getHistorys = async () => {
        try {
            const response = await fetch("http://192.168.63.12:5000/transaksi");
            const history = (await response.json()) as {
                response: {
                    carts: [];
                    id: number;
                    uuid: string;
                    totalHarga: number;
                    createdAt: string;
                }[];
            };
            const dataArray = history.response;
            setHistoryTransaksi(dataArray);
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
        getDataBarang();
    }, []);

    useEffect(() => {
        getHistorys();
    }, []);

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
                <Text style={styles.headTitle}>History Transaksi</Text>
            </View>
            {/* ------------ */}

            {/* menampilkan daftar menu */}
            <ScrollView style={{ paddingHorizontal: 8 }}>
                {/* menu bagian */}
                {historyTransaksi.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() =>
                            navigation.navigate("detail-transaksi", {
                                uuid: item.uuid,
                            })
                        }
                        style={styles.containerBarang}
                    >
                        <Text style={{ textDecorationLine: "underline" }}>
                            {item.createdAt.split("T")[0]}
                        </Text>
                        <View style={styles.barisInfo}>
                            <Text>Rp.{item.totalHarga}</Text>

                            <View style={styles.barisInfo2}>
                                <Text
                                    style={{ fontWeight: "700", fontSize: 20 }}
                                >
                                    #{index + 1}
                                </Text>
                                <View
                                    style={{
                                        flexDirection: "column",
                                        width: 200,
                                        justifyContent: "center",
                                        alignItems: "flex-end"
                                    }}
                                >
                                    {item.carts.slice(0, 3).map((e, index) => (
                                        <View
                                            style={{ flexDirection: "row" }}
                                            key={index}
                                        >
                                            <Text
                                                key={index}
                                                style={{ width: 80 }}
                                            >
                                                {/* menampilkan nama barang berdasarkan no Id barang pada data carts */}
                                                {
                                                    barang.find(
                                                        (b) =>
                                                            b.id === e.barangId,
                                                    )?.nama
                                                }
                                            </Text>
                                            <Text>{e.qty}x</Text>
                                        </View>
                                    ))}
                                    <Text>...</Text>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
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
    searchHotel: {
        width: 270,
        borderWidth: 2,
    },
    containerBarang: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
        backgroundColor: "#FFF",
        padding: 5,
        paddingVertical: 15,
        borderRadius: 12,
        paddingHorizontal: 15,
        elevation: 12
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

export default HistoryTransaksi;
