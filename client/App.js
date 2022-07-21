import { Platform, StyleSheet, View, StatusBar } from "react-native";
import { NavigationContainer} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { WatchListProvider } from "./contexts/WatchListContext";
import { EmailProvider } from "./contexts/EmailContext";
import { TokenProvider } from "./contexts/TokenContext";
import LoginStack from "./screens/LoginStack";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#3e9c35",
  },
};

const Stack = createStackNavigator();

export default function App(props) {
  return (
    <PaperProvider theme={theme}>
      <View style={styles.container}>
        <WatchListProvider>
          <EmailProvider>
            <TokenProvider>
              {Platform.OS === "ios" && <StatusBar barStyle="default" />}
              <NavigationContainer>
                <Stack.Navigator
                  screenOptions={{
                    headerShown: false,
                  }}
                >
                  <Stack.Screen name="SignIn" component={LoginStack} />
                </Stack.Navigator>
              </NavigationContainer>
            </TokenProvider>
          </EmailProvider>
        </WatchListProvider>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
