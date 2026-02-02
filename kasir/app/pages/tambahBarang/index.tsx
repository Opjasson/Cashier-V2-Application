import { NavigationProp } from "@react-navigation/native";
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
}

const TambahBarang: React.FC<props> = ({ navigation }) => {
    const [nama, setNama] = useState<string>();
    const [harga_jual, setharga_jual] = useState<number>();
    const [harga_beli, setharga_beli] = useState<number>();
    const [stok, setStok] = useState<number>();

    const handleSave = async () => {
        try {
            await fetch("http://192.168.207.12:5000/barang", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nama: nama,
                    harga_jual: harga_jual,
                    harga_beli: harga_beli,
                    stok: stok,
                }),
            });
            alert("Barang berhasil ditambahkan!");
            navigation.navigate("manage-barang");
        } catch (error) {
            console.log(error);
        }
    };

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
                    onChangeText={(text) => setNama(text.toLowerCase())}
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
                    onChangeText={(text) => setStok(Number(text))}
                />
            </View>
            {/* End Form */}

            <TouchableOpacity style={styles.button} onPress={handleSave}>
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

export default TambahBarang;
