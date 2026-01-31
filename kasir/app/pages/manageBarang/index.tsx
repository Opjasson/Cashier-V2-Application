import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import MenuDrawer from "react-native-side-drawer";
import React, { useEffect, useState } from "react";
import Fontisto from "@expo/vector-icons/Fontisto";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { DrawerContent } from "@/app/components";
import { SafeAreaView } from "react-native-safe-area-context";

interface props {
    navigation: NavigationProp<any, any>;
}

interface RootStackParamList {
    "manage-barang": undefined;
}

const ManageBarang: React.FC<props> = ({ navigation }) => {
    const [find, setFind] = useState<string>();
    const [open, setOpen] = useState(false);
    const [data, setData] = useState<
        {
            id: number;
            nama: string;
            harga_jual: number;
            stok: number;
        }[]
    >([]);
    const [refresh, setRefresh] = useState<boolean>(false);

    const getDataBarang = async () => {
        const response = await fetch("http://192.168.159.12:5000/barang");
        const barang = await response.json();
        setData(barang);
    };

    useEffect(() => {
        getDataBarang();
    }, [refresh]);

    const toggleOpen = () => {
        if (open === false) {
            setOpen(true);
        } else {
            setOpen(false);
        }
    };

    const pindahHalaman = useNavigation<NavigationProp<RootStackParamList>>();

    const handleDelete = async (id: number) => {
        try {
            await fetch(`http://192.168.159.12:5000/barang/${id}`, {
                method: "DELETE",
            });
            if (refresh) {
                setRefresh(false);
            } else {
                setRefresh(true);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const info = (id: number) => {
        Alert.alert(
            "Hapus data ini?",
            "Pilih Ya untuk hapus pilih tidak untuk kembali",
            [
                {
                    text: "Ya",
                    onPress: () => handleDelete(id),
                    style: "default",
                },
                {
                    text: "Tidak",
                    onPress: () => pindahHalaman.navigate("manage-barang"),
                    style: "default",
                },
            ],
        );
    };

    const filterData = data.filter((item) => {
        if (find) {
            const words = find?.split(" ");
            return words?.some((word) => item.nama.includes(word));
        } else {
            return data;
        }
    });

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
                <Text style={styles.headTitle}>Manage Barang</Text>
            </View>
            {/* ------------ */}

            <View style={styles.containerTambah}>
                <TouchableOpacity
                    style={styles.tambahBarang}
                    onPress={() => navigation.navigate("tambah-barang")}
                >
                    <FontAwesome6 name="add" size={25} color="white" />
                    <Text style={{ fontSize: 17, color: "white" }}>Tambah</Text>
                </TouchableOpacity>

                {/* bagian pencarian barang */}
                <View style={styles.containerSearch}>
                    <TextInput
                        placeholder="Cari Nama Barang"
                        style={styles.searchHotel}
                        onChangeText={(text) => {
                            setFind(text.toLowerCase());
                        }}
                    />
                    <Entypo name="magnifying-glass" size={30} color="black" />
                </View>
                {/* --------------- */}
            </View>

            {/* menampilkan daftar menu */}
            <ScrollView>
                {/* menu bagian */}
                {filterData.map((item, index) => (
                    <View style={styles.containerMenu} key={index}>
                        <View style={styles.menu}>
                            <Text style={styles.menu1}>
                                {item.nama.toLocaleUpperCase()}
                            </Text>
                            <Text style={styles.menu2}>
                                Rp. {item.harga_jual}
                            </Text>
                            <Text style={styles.menu3}>
                                Stok : {item.stok} pcs
                            </Text>
                        </View>
                        <View style={styles.actionMenu}>
                            <TouchableOpacity
                                onPress={() =>
                                    navigation.navigate("ubah-barang", {
                                        id: item.id,
                                        data: item,
                                    })
                                }
                                style={styles.menuIcon}
                            >
                                <FontAwesome
                                    name="pencil"
                                    size={30}
                                    color="black"
                                />
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => info(item.id)}
                                style={styles.menuIcon}
                            >
                                <Fontisto
                                    name="trash"
                                    size={30}
                                    color="black"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
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
        backgroundColor: "#27548A",
    },
    headTitle: {
        fontSize: 20,
        marginLeft: 30,
        color: "white",
    },
    containerTambah: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        paddingHorizontal: 5,
    },
    tambahBarang: {
        flexDirection: "row",
        borderRadius: 10,
        alignItems: "center",
        backgroundColor: "green",
        gap: 5,
        height: 40,
        paddingHorizontal: 5,
        marginTop: 5,
    },
    containerSearch: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 10,
        backgroundColor: "#F8F4E1",
        paddingHorizontal: 5,
        borderRadius: 10,
        elevation: 5,
    },
    searchHotel: {
        width: 240,
    },
    containerMenu: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
        backgroundColor: "#FFF085",
        padding: 5,
    },
    menu1: {
        fontSize: 18,
        fontWeight: "800",
    },
    menu2: {
        fontSize: 15,
    },
    menu3: {
        fontSize: 13,
    },
    menuIcon: {
        fontSize: 30,
        borderWidth: 2,
        backgroundColor: "#F8F4E1",
        paddingHorizontal: 10,
        justifyContent: "center",
    },
    trashIcon: {
        fontSize: 30,
    },
    menu: {},
    actionMenu: {
        flexDirection: "row",
        width: 115,
        gap: 5,
    },
});

export default ManageBarang;
