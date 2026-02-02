import Button from "@/app/components/moleculs/Button";
import { NavigationProp, RouteProp } from "@react-navigation/native";
import React, { useState } from "react";
import {
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

interface props {
    navigation: NavigationProp<any, any>;
    route: RouteProp<any, any>;
}

const TambahAkun: React.FC<props> = ({ navigation, route }) => {
    const [email, setEmail] = useState<string>();
    const [password, setPassword] = useState<string>();
    const [confPassword, setConfPassword] = useState<string>();
    const [error, setError] = useState<string>();

    const handleRegister = async () => {
        if (email && password && confPassword) {
            const response = await fetch("http://192.168.63.12:5000/user", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    confPassword: confPassword,
                }),
            });

            if (JSON.stringify(response.status) === "400") {
                setError("Password dan confPassword tidak sama!");
            } else {
                alert("Berhasil membuat akun");
                navigation.navigate("settingAkun");
            }
        } else {
            setError("Isi dengan lengkap!");
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#3bb9f7" barStyle="light-content" />

            <View style={styles.headInfo}>
                <Text
                    style={{ fontSize: 26, fontWeight: "700", color: "white" }}
                >
                    Buat akun baru untuk Kasir
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

            {/* Form Update */}
            <ScrollView>
                <View style={styles.containerForm}>
                    <Text style={error ? styles.errorMsg : styles.hidden}>
                        {error}
                    </Text>

                    <Text style={styles.textLabel}>Email</Text>
                    <TextInput
                        style={{
                            borderWidth: 1,
                            marginBottom: 5,
                            borderRadius: 5,
                        }}
                        keyboardType="email-address"
                        placeholder="Masukan email anda"
                        onChangeText={(text) => setEmail(text)}
                    />

                    <Text style={styles.textLabel}>Password</Text>
                    <TextInput
                        style={{
                            borderWidth: 1,
                            marginBottom: 5,
                            borderRadius: 5,
                        }}
                        keyboardType="default"
                        placeholder="Masukan password anda"
                        secureTextEntry
                        onChangeText={(text) => setPassword(text)}
                    />

                    <Text style={styles.textLabel}>Confirm Password</Text>
                    <TextInput
                        style={{
                            borderWidth: 1,
                            marginBottom: 5,
                            borderRadius: 5,
                        }}
                        keyboardType="default"
                        placeholder="Masukan ulang password anda"
                        secureTextEntry
                        onChangeText={(text) => setConfPassword(text)}
                    />
                </View>
                {/* End Form */}

                <Button
                    aksi={handleRegister}
                    style={[
                        styles.button,
                        { marginHorizontal: "auto", width: 190, marginTop: 10 },
                    ]}
                >
                    Buat akun
                </Button>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    hidden: {
        display: "none",
    },
    errorMsg: {
        fontSize: 18,
        color: "red",
        textAlign: "center",
    },
    headInfo: {
        borderRadius: 15,
        padding: 5,
        paddingHorizontal: 10,
        paddingBottom: 19,
        backgroundColor: "#FF9B51",
        gap: 8,
        marginBottom: 10,
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
    containerForm: {
        paddingHorizontal: 5,
    },
    button: {
        backgroundColor: "#FF9B51",
        width: 100,
        padding: 8,
        alignItems: "center",
        borderRadius: 9,
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

export default TambahAkun;
