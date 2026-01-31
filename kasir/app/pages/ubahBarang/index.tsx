import { NavigationProp, RouteProp } from "@react-navigation/native";
import React, { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

interface props {
    navigation: NavigationProp<any, any>;
    route: RouteProp<any, any>;
}

const Ubahbarang: React.FC<props> = ({ navigation, route }) => {
    // Get id menggunakan params di previos page
    const index = route.params?.id;
    const sendData = route.params?.data;

    const [nama, setNama] = useState<string>(sendData.nama);
    const [harga_jual, setharga_jual] = useState<number>(sendData.harga_jual);
    const [harga_beli, setharga_beli] = useState<number>(sendData.harga_beli);
    const [stok, setStok] = useState(sendData.stok);

    // function mengubah barang
    const updateBarang = async () => {
        try {
            await fetch(`http://192.168.159.12:5000/barang/${index}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nama: nama,
                    harga_jual: harga_jual,
                    harga_beli: harga_beli,
                    stok: Number(stok),
                }),
            });
            alert("Barang berhasil dirubah!");
            navigation.navigate("manage-barang");
        } catch (error) {
            console.log(error);
        }
    };
    // -----------------

    return (
        <ScrollView>
            <View style={styles.containerForm}>
                <Text style={styles.textLabel}>Nama Barang</Text>
                <TextInput
                    style={{
                        borderWidth: 1,
                        marginBottom: 5,
                        borderRadius: 5,
                    }}
                    keyboardType="default"
                    placeholder="Nama barang"
                    onChangeText={(text) => setNama(text)}
                    value={nama}
                />

                <Text style={styles.textLabel}>Harga Jual</Text>
                <TextInput
                    style={{
                        borderWidth: 1,
                        marginBottom: 5,
                        borderRadius: 5,
                    }}
                    keyboardType="numeric"
                    placeholder="Rp."
                    value={String(harga_jual)}
                    onChangeText={(text) => setharga_jual(Number(text))}
                />

                <Text style={styles.textLabel}>Harga Beli</Text>
                <TextInput
                    style={{
                        borderWidth: 1,
                        marginBottom: 5,
                        borderRadius: 5,
                    }}
                    keyboardType="numeric"
                    placeholder="Rp."
                    value={String(harga_beli)}
                    onChangeText={(text) => setharga_beli(Number(text))}
                />

                <Text style={styles.textLabel}>Stok</Text>
                <TextInput
                    style={{
                        borderWidth: 1,
                        marginBottom: 5,
                        borderRadius: 5,
                    }}
                    placeholder="/Pcs"
                    keyboardType="numeric"
                    onChangeText={(text) => setStok(text)}
                    value={stok + ""}
                />
            </View>
            {/* End Form */}

            <TouchableOpacity style={styles.button} onPress={updateBarang}>
                <Text style={{ color: "white" }}>Kirim</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    containerForm: {
        paddingHorizontal: 5,
    },
    button: {
        backgroundColor: "#FF9B51",
        width: 100,
        padding: 8,
        alignItems: "center",
        borderRadius: 9,
        color: "black",
        marginHorizontal: "auto",
    },
    topBar: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginBottom: 30,
    },
    textLabel: {
        fontWeight: "bold",
        fontSize: 18,
        paddingHorizontal: 3,
    },
});

export default Ubahbarang;
