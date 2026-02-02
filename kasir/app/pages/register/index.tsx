import { NavigationProp } from "@react-navigation/native";
import React, { useState } from "react";
import {
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

interface props {
    navigation: NavigationProp<any, any>;
}

const Register: React.FC<props> = ({ navigation }) => {
    const [email, setEmail] = useState<string>();
    const [password, setPassword] = useState<string>();
    const [confPassword, setConfPassword] = useState<string>();
    const [error, setError] = useState<string>();

    const handleRegister = async () => {
        if (email && password && confPassword) {
            const response = await fetch("http://192.168.207.12:5000/user", {
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
                setError("Password dan confirm password salah!");
            } else {
                alert("Berhasil membuat akun");
                navigation.navigate("login");
            }
        } else {
            setError("Isi semua formulir!");
        }
    };

    return (
        <ScrollView>
            <StatusBar barStyle={"light-content"} backgroundColor={"#1F1F1F"} />
            <View style={styles.containerForm}>
                <View style={styles.headRegister}>
                    <Text style={styles.headRegisterText1}>
                        Halaman Register
                    </Text>
                    <Text style={styles.headRegisterText2}>
                        Buat akun baru sebelum Login
                    </Text>
                    <Text style={styles.garisHead}></Text>
                </View>
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

                <Text style={error ? styles.errorMsg : styles.hidden}>
                    {error}
                </Text>
            </View>
            {/* End Form */}

            <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={{ color: "white" }}>Register</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.buatAkun}
                onPress={() => navigation.navigate("login")}
            >
                <Text>Sudah punya akun? Login disini</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    containerForm: {
        paddingHorizontal: 15,
        paddingTop: 150,
    },
    headRegister: {
        alignItems: "center",
        marginBottom: 40,
    },
    headRegisterText1: {
        fontSize: 30,
        fontWeight: "900",
        marginBottom: 10,
        color: "#FF9B51",
    },
    headRegisterText2: {
        fontSize: 20,
        fontWeight: "light",
    },
    garisHead: {
        borderBottomWidth: 3,
        width: "70%",
        marginTop: -10,
    },
    button: {
        backgroundColor: "#FF9B51",
        width: "80%",
        paddingVertical: 15,
        alignItems: "center",
        borderRadius: 9,
        marginTop: 20,
        marginHorizontal: "auto",
    },
    buatAkun: {
        width: "80%",
        paddingVertical: 15,
        alignItems: "center",
        borderRadius: 9,
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
    errorMsg: {
        fontSize: 18,
        color: "red",
        textAlign: "center",
    },
    hidden: {
        display: "none",
    },
});

export default Register;
