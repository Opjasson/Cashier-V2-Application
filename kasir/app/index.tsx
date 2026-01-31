import { NavigationContainer, NavigationIndependentTree } from "@react-navigation/native";
import { Text, View } from "react-native";
import Route from "./routes";

export default function Index() {
  return (
    <NavigationIndependentTree>
      <NavigationContainer>
        <Route />
      </NavigationContainer>
    </NavigationIndependentTree>
  );
}
