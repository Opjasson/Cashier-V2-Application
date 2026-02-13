import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useEffect, useState } from "react";
import {
    Alert,
    BackHandler,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import {
    NavigationProp,
    RouteProp,
    useFocusEffect,
} from "@react-navigation/native";

import { DrawerContent } from "@/app/components";
import MenuDrawer from "react-native-side-drawer";

import Feather from "@expo/vector-icons/Feather";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    SafeAreaView,
    useSafeAreaInsets,
} from "react-native-safe-area-context";

interface props {
    navigation: NavigationProp<any, any>;
    route: RouteProp<any, any>;
}

const Kasir: React.FC<props> = ({ navigation, route }) => {
    const [data, setData] = useState<
        {
            id: number;
            nama: string;
            harga_jual: number;
            stok: number;
        }[]
    >([]);
    const [find, setFind] = useState<string>("");
    const [open, setOpen] = useState(false);
    const [totalHarga, setTotalHarga] = useState<number>();
    const [qtyBarangBelanja, setQtyBarangBelanja] = useState<number>();
    const [userId, setUserId] = useState("");
    const [cart, setCart] = useState<
        {
            id: number;
            nama: string;
            harga_jual: number;
            stok?: number;
            qty: number;
        }[]
    >([]);

    const login = route.params?.data;

    // Handle jika user klik tombol kembali handphone
    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                // kalau mau keluar app:
                Alert.alert("Keluar", "Yakin mau keluar aplikasi?", [
                    { text: "Batal", style: "cancel" },
                    { text: "Ya", onPress: () => BackHandler.exitApp() },
                ]);
                return true; // cegah kembali ke login
            };

            const subscription = BackHandler.addEventListener(
                "hardwareBackPress",
                onBackPress,
            );

            return () => subscription.remove(); // hapus listener dengan cara baru
        }, []),
    );
    // end handle tombol kembali

    const getDataBarang = async () => {
        const response = await fetch("http://192.168.106.12:5000/barang");
        const barang = await response.json();
        setData(barang);
    };

    useEffect(() => {
        getDataBarang();
    }, []);

    const addCart = (id: number) => {
        if (cart.find((item) => item.id === id)) {
            setCart(
                cart.map((barang) =>
                    barang.id === id
                        ? { ...barang, qty: barang.qty + 1 }
                        : barang,
                ),
            );
        } else {
            const barang_Masuk = data.filter((item) => item.id === id);
            barang_Masuk.map((a) =>
                setCart([
                    ...cart,
                    { id, nama: a.nama, qty: 1, harga_jual: a.harga_jual },
                ]),
            );
        }
    };

    const minQty = (id: number) => {
        setCart(
            cart
                .map((barang) =>
                    barang.id === id
                        ? {
                              ...barang,
                              qty: barang.qty > 0 ? barang.qty - 1 : 0,
                          }
                        : barang,
                )
                .filter((barang) => barang.qty > 0),
        );
    };
    console.log(cart);

    useEffect(() => {
        if (cart.length > 0) {
            const sum = cart.reduce((acc, item) => {
                const product = data.find((e) => e.id === item.id);
                return acc + product!.harga_jual * item.qty;
            }, 0);
            setTotalHarga(sum);

            const sumJumlahBarang = cart.reduce((acc, item) => {
                return acc + item.qty;
            }, 0);
            setQtyBarangBelanja(sumJumlahBarang);
        } else {
            setTotalHarga(0);
            setQtyBarangBelanja(0);
        }
    }, [cart, data]);

    useEffect(() => {
        const checkUserId = async () => {
            const token = await AsyncStorage.getItem("userId");
            setUserId(token!!);
            console.log("TOKEN : ", token);
        };

        checkUserId();
    }, []);

    const filterData = Object.values(data).filter((item) => {
        const words = find?.split(" ");
        return words?.some((word) => item.nama?.includes(word));
    });

    const prosesCart = async () => {
        const response = await fetch("http://192.168.106.12:5000/transaksi", {
            method: "POST",
        });
        const transaksi = await response.json();

        navigation.navigate("proses-transaksi", {
            cart: cart,
            totalHarga: totalHarga,
            transaksiData: transaksi.response.id,
        });
    };

    // fungsi untuk membuka sidebar
    const toggleOpen = () => {
        if (open === false) {
            setOpen(true);
        } else {
            setOpen(false);
        }
    };
    // ---------------

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

    const inset = useSafeAreaInsets();

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={"#FF9B51"} barStyle={"light-content"} />
            {/* bagian atas aplikasi kasir */}
            <View style={styles.headContainer}>
                <Ionicons
                    name="menu"
                    size={30}
                    color="white"
                    onPress={() => toggleOpen()}
                />
                <Text style={styles.headTitle}>Transaksi Baru</Text>

                <TouchableOpacity
                    style={
                        userId != "2"
                            ? styles.settingHidden
                            : styles.settingShow
                    }
                    onPress={() => navigation.navigate("settingAkun")}
                >
                    <Feather
                        name="settings"
                        style={{ marginLeft: 80 }}
                        size={30}
                        color="white"
                    />
                </TouchableOpacity>
            </View>
            {/* ------------ */}

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

            {/* menampilkan daftar menu */}
            <ScrollView>
                {/* menu bagian */}
                {filterData.map((item, index) => (
                    <View key={index} style={styles.containerMenu}>
                        <View>
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
                            {/* icon minus */}
                            <TouchableOpacity
                                style={styles.menuIcon}
                                onPress={() => minQty(item.id)}
                            >
                                <Entypo name="minus" size={30} color="black" />
                            </TouchableOpacity>
                            {/* --------- */}

                            <TouchableOpacity
                                onPress={() => addCart(item.id)}
                                style={{
                                    backgroundColor: "#F8F4E1",
                                    borderWidth: 2,
                                    borderRadius: 8,
                                    paddingHorizontal: 10,
                                    justifyContent: "center",
                                    display: cart.find((k) => k.id === item.id)
                                        ? "flex"
                                        : "none",
                                }}
                            >
                                {cart.find((a) => a.id === item.id) ? (
                                    <Text
                                        style={{
                                            paddingHorizontal: 9,
                                            display: "flex",
                                        }}
                                    >
                                        {
                                            cart.find((a) => a.id === item.id)
                                                ?.qty
                                        }
                                    </Text>
                                ) : (
                                    ""
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={{
                                    borderWidth: 2,
                                    borderRadius: 8,
                                    backgroundColor: "#F8F4E1",
                                    paddingHorizontal: 10,
                                    justifyContent: "center",
                                    display: cart.some((a) => a.id === item.id)
                                        ? "none"
                                        : "flex",
                                }}
                                onPress={() => addCart(item.id)}
                            >
                                <FontAwesome6
                                    name="add"
                                    size={30}
                                    color="black"
                                />
                            </TouchableOpacity>

                            {/* icon plus */}

                            {/* ---------- */}
                        </View>
                    </View>
                ))}

                {/* ------------ */}
            </ScrollView>
            {/* ---------- */}
            <TouchableOpacity
                style={[styles.containerCart, { bottom: inset.bottom }]}
                activeOpacity={0.9}
                onPress={prosesCart}
            >
                <View style={styles.cartContent1}>
                    <Text style={styles.cartContent2}>
                        Pcs : {qtyBarangBelanja}
                    </Text>
                </View>

                <Text style={styles.cartContent2}>Total : Rp.{totalHarga}</Text>
            </TouchableOpacity>

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
    settingShow: {
        display: "flex",
    },
    settingHidden: {
        display: "none",
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
        alignItems: "center",
        marginHorizontal: "auto",
        marginTop: 10,
        backgroundColor: "#F8F4E1",
        paddingHorizontal: 5,
        borderRadius: 10,
        elevation: 5,
    },
    searchHotel: {
        width: 270,
    },
    containerMenu: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
        backgroundColor: "#FFF",
        padding: 8,
        marginHorizontal: 12,
        borderRadius: 8,
        elevation: 12,
    },
    menuIcon: {
        fontSize: 30,
        borderWidth: 2,
        borderRadius: 50,
        backgroundColor: "#F8F4E1",
        paddingHorizontal: 10,
        justifyContent: "center",
    },
    trashIcon: {
        fontSize: 30,
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
    actionMenu: {
        flexDirection: "row",
        gap: 5,
    },
    containerCart: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 10,
        height: 70,
        width: "100%",
        position: "absolute",
        backgroundColor: "#FF9B51",
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        paddingTop: 5,
        zIndex: 999,
    },
    cartContent1: {
        flexDirection: "row",
        width: 120,
        gap: 5,
    },
    cartContent2: {
        fontSize: 18,
        fontWeight: "700",
        color: "white",
    },
});

export default Kasir;
