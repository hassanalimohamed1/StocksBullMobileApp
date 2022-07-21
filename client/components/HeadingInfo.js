import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "react-native";
import 'react-native-get-random-values'
import { Title, Subheading } from "react-native-paper";
import pctcolour from "./utils/pctColour";
import rounding from "./utils/rounding";



export default function HeadingInfo(props) {


let message = Object.keys(props.overview)

  //If length is 1, means an error occured therefore message is displayed
  if (message == "Note" || message == "Error Message") {
    return (
      <>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text>Heading Unavailable</Text>
        </View>
      </>
    );
  }

  return (
    <>
      <View>
        <Text>
          <Title>{props.profile.Symbol}</Title>
          <Text> | </Text>
          <Subheading style={{ fontSize: 10 }}>{props.profile.Name}</Subheading>
        </Text>
        <View style={{
               marginVertical: 8,
               borderBottomColor: "#737373",
               borderBottomWidth: StyleSheet.hairlineWidth,
        }} />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingLeft: 10,
          }}
        >
          {Object.entries(props.overview).map((row, index) => (

              <Title key={index}>
                {`$${rounding(row["1"]["05. price"])}`}
              </Title>
          ))}
        </View>

        <View style={{ flexDirection: "row", paddingLeft: 10 }}>
          {Object.entries(props.overview).map((row, index) => (
        
              <Text
              key={index}
                style={{ color: pctcolour(row["1"]["09. change"]) }}
              >
                {`${rounding(row["1"]["10. change percent"])}%`}
              </Text>
          ))}
        </View>
      </View>
    </>
  );
}
