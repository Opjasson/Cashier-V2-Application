import React, { useEffect, useState } from "react";
import {
    Text,
    View,
    StyleSheet,
    StatusBar,
    TouchableOpacity,
    Alert,
} from "react-native";

import { NavigationProp } from "@react-navigation/native";
import Button from "@/app/components/moleculs/Button";

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

    const [id, setId] = useState<number>();

    const getUserId = async () => {
        const response = await fetch("http://192.168.159.12:5000/login");
        const data = await response.json();
        setId(Object.values(data)[0]?.userId);
    };

    useEffect(() => {
        getUserId();
    }, []);

    // useEffect(() => {
    //     if (id !== 2) {
    //         navigation.navigate("Home");
    //     }
    // });

    // Get data lewat api
    const fetchData = async () => {
        const response = await fetch("http://192.168.159.12:5000/user");
        const data = await response.json();
        console.log(data.data);

        setUser(data.data);
    };

    // Get data lewat api
    const deleteAkun = async (id: number) => {
        const response = await fetch(`http://192.168.159.12:5000/user/${id}`, {
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
            <StatusBar backgroundColor="#3bb9f7" barStyle="light-content" />

            <View style={styles.headInfo}>
                <Text
                    style={{ fontSize: 26, fontWeight: "700", color: "white" }}
                >
                    Setting akun kasir
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
        backgroundColor: "#27548A",
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
        backgroundColor: "#27548A",
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
});
export default SetAkun;
