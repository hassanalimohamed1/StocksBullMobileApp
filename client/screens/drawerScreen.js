import * as React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import BottomTabNavigator from "../navigation/BottomTabNavigator";

import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";

const Drawer = createDrawerNavigator();

export default function DrawerNav({ navigation }) {
  function onPress() {
    navigation.navigate("Login");
  }

  function CustomDrawerContent(props) {
    return (
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
        <DrawerItem label="Sign Out" onPress={onPress} />
      </DrawerContentScrollView>
    );
  }

  return (
    <Drawer.Navigator
      useLegacyImplementation
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      initialRouteName="Login"
      options={{ headerShown: false }}
    >
      <Drawer.Screen name="Close" component={BottomTabNavigator} />
    </Drawer.Navigator>
  );
}
