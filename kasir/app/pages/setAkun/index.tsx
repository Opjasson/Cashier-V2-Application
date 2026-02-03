import React, { useEffect, useState } from "react";
import {
    Alert,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import Button from "@/app/components/moleculs/Button";
import { NavigationProp } from "@react-navigation/native";

interface props {
    navigation: NavigationProp<any, any>;
}

const SetAkun: React.FC<props> = ({ navigation }) => {
    const [user, setUser] = useState<
        {
            id: number;
            email: string;
        }[]
    >([]);
    const [usersAbsen, setUsersAbsen] = useState<{
            email: string;
            role: string;
        }[]>([]);
    // const navigate = useNavigate();
   

    const handleDetail = (id) => {
        alert(`Lihat detail karyawan dengan ID: ${id}`);
        // di sini bisa diarahkan ke halaman detail absensi
        // contoh: navigate(`/karyawan/${id}`)
    };

    useEffect(() => {
        const getDataAbsen = async () => {
            try {
                const response = await fetch(`http://192.168.63.12:5000/user`);
                const data = await response.json();
                setUsersAbsen(data.data);
                console.log("DATAUSER",data.data);
            } catch (error) {
                console.log(error);
            }
        };

        getDataAbsen();
    }, []);

    // const filterKasirOnly = users.filter((item) => item.role === "kasir");
    // console.log(filterKasirOnly);

    // const [id, setId] = useState<number>();

    // const getUserId = async () => {
    //     const response = await fetch("http://192.168.63.12:5000/login");
    //     const data = await response.json();
    //     setId(Object.values(data)[0]?.userId);
    // };

    // useEffect(() => {
    //     getUserId();
    // }, []);

    // useEffect(() => {
    //     if (id !== 2) {
    //         navigation.navigate("Home");
    //     }
    // });

    // Get data lewat api
    const fetchData = async () => {
        const response = await fetch("http://192.168.63.12:5000/user");
        const data = await response.json();
        console.log(data.data);

        setUser(data.data);
    };

    // Get data lewat api
    const deleteAkun = async (id: number) => {
        const response = await fetch(`http://192.168.63.12:5000/user/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (response) {
            Alert.alert("Data berhasl dihapus!");
            navigation.navigate("settingAkun");
        }
    };

    // console.log(user);
    useEffect(() => {
        fetchData();
    }, []);

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#FF9B51" barStyle="light-content" />

            <View style={styles.headInfo}>
                <Text
                    style={{ fontSize: 26, fontWeight: "700", color: "white" }}
                >
                    Halaman Admin
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
                                <Text style={styles.cardTitle}>Daftar Karyawan</Text>
                            </View>
            
                            {/* Tabel Absensi */}
                            <View style={styles.table}>
                                {/* Header */}
                                <View style={styles.tableHeader}>
                                    <Text style={[styles.th, { flex: 0.5 }]}>No</Text>
                                    <Text style={[styles.th, { flex: 1.5 }]}>Nama</Text>
                                    <Text style={styles.th}>Detail</Text>
                                </View>
            
                                {/* Row */}
                                {usersAbsen.map((a, index) => (
                                    <View style={styles.tableRow} key={index}>
                                        <Text style={[styles.td, { flex: 0.5 }]}>
                                            {index + 1}
                                        </Text>
                                        <Text style={[styles.td, { flex: 1.5 }]}>
                                            {a.email}
                                        </Text>
                                        <Text style={styles.td}>Detail</Text>
                                    </View>
                                ))}
                            </View>
                        </ScrollView>

            <Button
                aksi={() => navigation.navigate("tambahAkun")}
                style={styles.button}
                styleTitle={styles.buttonTitle}
            >
                Tambah akun
            </Button>

            <Button
                aksi={() => navigation.navigate("kasir")}
                style={styles.button2}
                styleTitle={styles.buttonTitle}
            >
                Home
            </Button>

            <View
                style={{
                    flexDirection: "row",
                    borderTopWidth: 2,
                    borderBottomWidth: 2,
                    justifyContent: "space-between",
                    width: "85%",
                    marginHorizontal: "auto",
                    marginBottom: 10,
                }}
            >
                <Text style={{ fontSize: 18, width: "60%" }}>Email</Text>
                <Text style={{ fontSize: 18, width: "40%" }}>Aksi</Text>
            </View>

            {user.map((item, index) => (
                <View
                    key={index}
                    style={{
                        flexDirection: "row",
                        borderBottomWidth: 2,
                        justifyContent: "space-between",
                        width: "85%",
                        marginHorizontal: "auto",
                        marginBottom: 8,
                    }}
                >
                    <Text style={{ fontSize: 18, width: "60%" }}>
                        {item.email}
                    </Text>
                    <View
                        style={{
                            flexDirection: "row",
                            width: "40%",
                            gap: 8,
                        }}
                    >
                        <TouchableOpacity
                            onPress={() =>
                                navigation.navigate("ubahAkun", {
                                    id: item.id,
                                    data: item,
                                })
                            }
                        >
                            <Text style={{ fontSize: 18, color: "blue" }}>
                                Ubah
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => deleteAkun(item.id)}>
                            <Text style={{ fontSize: 18, color: "red" }}>
                                Hapus
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ))}
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
        display : "none"
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
export default SetAkun;
