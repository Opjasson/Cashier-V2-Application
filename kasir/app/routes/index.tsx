import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import {
    Kasir,
    ManageBarang,
    Ubahbarang,
    TambahBarang,
    HistoryTransaksi,
    DetailTransaksi,
    Login,
    Register,
    Laporan,
    SetAkun,
    TambahAkun,
    UbahAkun,
    CekEmail,
    ChangePass,
    Absen,
} from "../pages";
import ProsesTransaksi from "../pages/prosesTransaksi";

const Route = () => {
    const Stack = createStackNavigator();

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {/* <Stack.Screen name="register" component={Register} /> */}
            {/* <Stack.Screen name="login" component={Login} /> 
            <Stack.Screen name="cekEmail" component={CekEmail} />
            <Stack.Screen name="changePass" component={ChangePass} />  */}
            <Stack.Screen name="kasir" component={Kasir} />

            <Stack.Screen name="manage-barang" component={ManageBarang} />

            <Stack.Screen
                name="history-transaksi"
                component={HistoryTransaksi}
            />

            <Stack.Screen
                name="laporan"
                component={Laporan}
            />

            <Stack.Screen
                name="absen"
                component={Absen}
            />
            
            <Stack.Screen
                options={{
                    headerShown: true,
                    headerTitle: "Ubah barang",
                }}
                name="ubah-barang"
                component={Ubahbarang}
            />
            <Stack.Screen
                options={{
                    headerShown: true,
                    headerTitle: "Tambah barang",
                }}
                name="tambah-barang"
                component={TambahBarang}
            />
            <Stack.Screen
                options={{
                    headerShown: true,
                    headerTitle: "Detail Transaksi",
                }}
                name="detail-transaksi"
                component={DetailTransaksi}
            />
            <Stack.Screen
                options={{
                    headerShown: true,
                    headerTitle: "Proses Transaksi",
                }}
                name="proses-transaksi"
                component={ProsesTransaksi}
            />

            <Stack.Screen
                options={{
                    headerShown: true,
                    headerTitle: "Set akun",
                }}
                name="settingAkun"
                component={SetAkun}
            />

            <Stack.Screen
                options={{
                    headerShown: true,
                    headerTitle: "Buat akun",
                }}
                name="tambahAkun"
                component={TambahAkun}
            />

            <Stack.Screen
                options={{
                    headerShown: true,
                    headerTitle: "Ubah akun",
                }}
                name="ubahAkun"
                component={UbahAkun}
            />
        </Stack.Navigator>
    );
};

export default Route;
