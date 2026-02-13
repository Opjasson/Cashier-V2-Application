import { NavigationProp, RouteProp } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface props {
    navigation: NavigationProp<any, any>;
    route: RouteProp<any, any>;
}

interface cartType {
    id: number;
    nama: string;
    qty: number;
    harga_jual: number;
}

const ProsesTransaksi: React.FC<props> = ({ navigation, route }) => {
    const [bayar, setBayar] = useState<number>(0);
    const [barang, setBarang] = useState<
        {
            id: number;
            nama: string;
            harga_jual: number;
            stok: number;
        }[]
    >([]);
    // dapat data cart dari halaman tambah transaksi
    const cart: cartType[] = route.params?.cart;
    const totalHarga = route.params?.totalHarga;
    const transaksiId = route.params?.transaksiData;
    const [namaPelanggan, setNamaPelanggan] = useState<string>();

    console.log("ini data transaksi", cart);

    const getDataBarang = async () => {
        try {
            const response = await fetch("http://192.168.106.12:5000/barang");
            const barang = await response.json();
            setBarang(barang);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getDataBarang();
    }, []);

    const createTransaksi = async () => {
        await fetch(`http://192.168.106.12:5000/transaksi/${transaksiId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                bayarPelanggan: bayar,
                totalHarga: totalHarga,
                namaPelanggan: namaPelanggan,
            }),
        });
        cart.forEach(async (item: any) => {
            await fetch("http://192.168.106.12:5000/cart", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    qty: item.qty,
                    transaksiId: transaksiId,
                    barangId: item.id,
                }),
            });
        });

        cart.forEach(async (item: any) => {
            const foundBarang = barang.find((e) => e.id === item.id);

            if (foundBarang) {
                await fetch(`http://192.168.106.12:5000/barang/${item.id}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        stok: foundBarang.stok - item.qty,
                    }),
                });
            } else {
                alert("barang tidak ditemukan");
            }
        });
        navigation.navigate("history-transaksi");
    };

    return (
        <SafeAreaView>
            {cart.map((item, index) => (
                <View key={index} style={styles.containerBarang}>
                    <Text>{item.nama}</Text>
                    <Text>{item.qty} x</Text>
                    <Text>{item.harga_jual}</Text>
                </View>
            ))}
            <Text style={styles.containerBarang}>Total : Rp.{totalHarga}</Text>
            <View style={{ paddingHorizontal: 12, marginTop: 8 }}>
                <Text>Nama Pelanggan :</Text>
                <TextInput
                    style={{
                        borderWidth: 1,
                        marginBottom: 5,
                        borderRadius: 5,
                    }}
                    onChangeText={(text) => setNamaPelanggan(text)}
                    keyboardType="default"
                    placeholder="Nama"
                />
                <Text>Bayar :</Text>
                <TextInput
                    style={{
                        borderWidth: 1,
                        marginBottom: 5,
                        borderRadius: 5,
                    }}
                    onChangeText={(text) => setBayar(Number(text))}
                    keyboardType="numeric"
                    placeholder="Bayar"
                />
                <Text>Kembali : Rp.{bayar ? bayar - totalHarga : 0}</Text>
            </View>

            <TouchableOpacity
                style={styles.tambahBarang}
                onPress={() => createTransaksi()}
            >
                <Text style={{ fontSize: 17, color: "white" }}>Tambah</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    containerBarang: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
        backgroundColor: "#FFF",
        padding: 5,
        paddingVertical: 15,
        borderRadius: 12,
        paddingHorizontal: 15,
        marginHorizontal: 15,
        elevation: 12,
    },
    tambahBarang: {
        flexDirection: "row",
        borderRadius: 10,
        alignItems: "center",
        backgroundColor: "green",
        gap: 5,
        height: 40,
        paddingHorizontal: 5,
        marginTop: 12,
        width: 250,
        alignSelf: "center",
        justifyContent: "center",
    },
});

export default ProsesTransaksi;
