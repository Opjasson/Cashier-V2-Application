import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";

interface props {
    onPress1: () => void;
    onPress2: () => void;
    onPress3: () => void;
    onPress4: () => void;
    onPress5: () => void;
    toggleOpen: () => void;
}

const DrawerContent: React.FC<props> = ({
    toggleOpen,
    onPress1,
    onPress2,
    onPress3,
    onPress4,
    onPress5,
}) => {
    return (
        <SafeAreaView style={styles.animatedBox}>
            <View style={styles.sidebarHead}>
                <FontAwesome5 name="cash-register" size={28} color="white" />
                <Text style={styles.sidebarTitle}>Toko Makmur Jaya</Text>
            </View>

            <View style={styles.sidebarMain}>
                <TouchableOpacity onPress={onPress1}>
                    <Text style={styles.sidebarMenu}>Transaksi Baru</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={onPress2}>
                    <Text style={styles.sidebarMenu}>Manage Menu</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={onPress3}>
                    <Text style={styles.sidebarMenu}>History transaksi</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={onPress5}>
                    <Text style={styles.sidebarMenu}>Laporan</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    activeOpacity={0.5}
                    style={styles.tutupSidebar}
                    onPress={onPress4}>
                    <Text
                        style={{
                            fontSize: 18,
                            fontWeight: "bold",
                            color: "red",
                            backgroundColor: "#FDFFB8",
                            padding : 10
                        }}>
                        Logout
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    activeOpacity={0.5}
                    style={styles.tutupSidebar}
                    onPress={toggleOpen}>
                    <Ionicons
                        name="arrow-back-circle-outline"
                        size={30}
                        color="black"
                    />
                    <Text style={{ fontSize: 18 }}>Tutup</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    animatedBox: {
        flex: 1,
        backgroundColor: "#FFF8F8",
    },
    sidebarHead: {
        flexDirection: "row",
        gap: 15,
        backgroundColor: "#27548A",
        padding: 15,
    },
    sidebarTitle: {
        fontSize: 17,
        fontWeight: "700",
        color: "white",
    },
    sidebarMain: {
        flexDirection: "column",
        justifyContent: "space-between",
        height: "50%",
        marginTop: 20,
        padding: 10,
    },
    sidebarMenu: {
        fontSize: 20,
        fontWeight: "800",
    },
    tutupSidebar: {
        flexDirection: "row",
        alignItems: "center",
    },
});

export default DrawerContent;
