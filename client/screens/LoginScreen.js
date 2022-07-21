import * as React from "react";
import { TextInput } from "react-native-paper";
import { Fragment } from "react/cjs/react.production.min";
import { Title } from "react-native-paper";
import { Paragraph } from "react-native-paper";
import { Button } from "react-native-paper";
import { useState, useEffect, useContext, useRef } from "react";

import EmailContext from "../contexts/EmailContext";
import TokenContext from "../contexts/TokenContext";

import {
  View,
  SafeAreaView,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
var validator = require("validator");
import frontlogo from "../assets/images/frontlogo.jpg";
import { LoginMessageColour } from "../components/utils/LoginMessageColour";

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

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [serverMessage, setServerMessage] = useState("");
  const [token, setToken] = useContext(TokenContext);
  const [key, setKey] = useContext(EmailContext);
  const firstRef = useRef("");
  const lastRef = useRef("");

  //Checking in the input added is in email format
  let validEmail = validator.isEmail(email);

  function check() {
    //If an error occurs server-side, send message back to the user and make input error
    if (serverMessage.message === "Successfully logged in.") {
      //Setting the email for the async key
      setKey(String(email));
      //Navigating to the home screen
      setTimeout(() => {
        //Loggin in
        navigation.navigate("Drawer");
      }, 500);
    }
  }

  function login() {
    //User enters a valid email, contact server and continue
    if (validEmail == true) {
      const url = `${process.env.SERVER_LINK}/login`;
      fetch(url, {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email, password: password }),
      })
        .then((res) => res.json())
        .then((res) => {
          //Server message
          setServerMessage(res);
          //Setting the JWT for authentication, if sucessful, used in other parts of app via UseContext
          setToken(res.token);
        });
    }
    //Invalid email, error screen
    else {
      setServerMessage({
        message: "Please enter a valid email address or password.",
      });
    }
  }

  //Checks for valid account each time the user clicks the register button
  useEffect(() => {
    check();
  }, [serverMessage]);

  return (
    <Fragment>
      <SafeAreaView style={styles.app}>
        <View style={{ padding: 25, alignItems: "center" }}>
          <View style={{ paddingTop: 70, alignItems: "center" }}>
            <Title style={{ fontSize: 30 }}>Welcome to StocksBull!</Title>
            <Paragraph>Save and view all stocks on the NASDAQ-100.</Paragraph>
          </View>
        </View>
        <View style={{ alignItems: "center" }}>
          <Text style={{ color: LoginMessageColour(serverMessage.message) }}>
            {serverMessage.message}
          </Text>
        </View>
        <TextInput
          style={styles.app}
          label="Email"
          value={email}
          onChangeText={(email) => setEmail(email)}
        />
        <TextInput
          style={styles.app}
          secureTextEntry={true}
          label="Password"
          value={password}
          onChangeText={(password) => setPassword(password)}
        />

        <View style={{ padding: 10, alignItems: "center" }}>
          <Button
            mode="contained"
            style={{ width: 100, borderRadius: 100 }}
            theme={theme}
            onPress={login}
          >
            Login
          </Button>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Paragraph>Not a member? Click here to </Paragraph>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Paragraph style={{ color: "#3e9c35" }}>
              create an account.
            </Paragraph>
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

export default LoginScreen;
