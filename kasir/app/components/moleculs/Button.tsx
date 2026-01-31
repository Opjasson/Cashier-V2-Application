import React from "react";
import { Text, TouchableOpacity } from "react-native";

interface Buttonprops {
    children: React.ReactNode;
    aksi: () => void;
    style?: any;
    disabled?: boolean;
    simbol?: React.ReactNode;
    styleTitle?: any;
}

const Button = ({
    style,
    aksi,
    children,
    disabled,
    simbol,
    styleTitle,
}: Buttonprops) => {
    return (
        <TouchableOpacity disabled={disabled} style={style} onPress={aksi}>
            {simbol}
            <Text style={styleTitle}>{children}</Text>
        </TouchableOpacity>
    );
};

export default Button;
