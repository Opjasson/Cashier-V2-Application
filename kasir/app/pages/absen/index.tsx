import { NavigationProp, RouteProp } from '@react-navigation/native';
import React from 'react'
import { Text, View } from 'react-native';

interface props {
    navigation: NavigationProp<any, any>;
    route: RouteProp<any, any>;
}

const Absen : React.FC<props> = ({navigation, route}) => {


  return (
    <View>
        <Text>
            Hallo world
        </Text>
    </View>
  )
}

export default Absen