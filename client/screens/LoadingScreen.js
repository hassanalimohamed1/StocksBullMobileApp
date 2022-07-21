import * as React from "react";
import { ActivityIndicator} from "react-native-paper";

export default function LoadingScreen() {
  return (
    <>
        <ActivityIndicator style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",}}
          animating={true} Colors={"#3e9c35"} /> 
    </>
  );
}
