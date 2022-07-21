import React, { useState } from "react";
import { TextInput } from "react-native-paper";
import { Fragment } from "react/cjs/react.production.min";
import { Title } from "react-native-paper";
import { Paragraph } from "react-native-paper";
import { Button } from "react-native-paper";
import messageColour from "../components/utils/messageColour";
var validator = require("validator");
import {
  View,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import frontlogo from "../assets/images/frontlogo.jpg";

const theme = {
  roundness: 5,
  colors: {
    primary: "#3e9c35",
    accent: "white",
  },
};

const styles = StyleSheet.create({
  app: {
    backgroundColor: "white",
  },
});

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [serverMessage, setServerMessage] = useState("");

  //Checking in the input added is in email format
  let validEmail = validator.isEmail(email);

  function register() {
    //If the user has entered a valid input
    if (validEmail == true) {
      //Calling the server
      const url = `${process.env.SERVER_LINK}/register`;
      fetch(url, {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email, password: password }),
      })
        .then((response) => response.json())
        .then((err) => {
          //Getting the message back from the server
          setServerMessage(err);
        });
    } else {
      //If user enters invalid email, send error message to user
      setServerMessage({
        message: "Please enter a valid email address or password.",
      });
    }
  }

  return (
    <Fragment>
      <SafeAreaView style={styles.app}>
        <View style={{ padding: 20, alignItems: "center" }}>
          <View style={{ paddingTop: 70, alignItems: "center" }}>
            <Title style={{ fontSize: 30 }}>Create an Account!</Title>
            <Paragraph>
              Enter your email and password to start looking for stocks today!
            </Paragraph>
            <View style={{ alignItems: "center", paddingTop: 20 }}>
              <Text style={{ color: messageColour(serverMessage.message) }}>
                {serverMessage.message}
              </Text>
            </View>
          </View>
        </View>
        <TextInput
          style={styles.app}
          label="Email"
          value={email}
          onChangeText={(email) => setEmail(email)}
        />
        <TextInput
          style={styles.app}
          label="Password"
          value={password}
          onChangeText={(password) => setPassword(password)}
        />
        <View style={{ padding: 10, alignItems: "center" }}>
          <Button
            mode="contained"
            theme={theme}
            onPress={register}
            style={{ width: 140, borderRadius: 100 }}
          >
            Register
          </Button>
        </View>

        <View style={{ flexDirection: "row" }}>
          <Paragraph>Have an Account? Click here to </Paragraph>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Paragraph style={{ color: "#3e9c35" }}>log in.</Paragraph>
          </TouchableOpacity>
        </View>
        <Image
          style={{ width: 470, height: 470 }}
          source={frontlogo}
          accessibilityLabel={"Stocks bull logo"}
        />
      </SafeAreaView>
    </Fragment>
  );
};

export default RegisterScreen;
