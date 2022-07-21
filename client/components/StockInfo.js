import React from "react";
import { View } from "react-native";
import { Text, ScrollView } from "react-native";
import longnumber from "./utils/longnumber";
import rounding from "./utils/rounding";

export default function StockInfo(props) {


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
          <Text>Addtional information Unavailable</Text>
        </View>
      </>
    );
  }


  return (
    <>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <ScrollView horizontal={true}>
          <View style={{ paddingRight: 20, paddingLeft: 20 }}>
            {Object.entries(props.overview).map((row, index) => (
              <View key={index}>
                <Text>
                  Open: {`${rounding(row["1"]["02. open"])}`}
                </Text>
                <Text>High: {`${rounding(row["1"]["03. high"])}`}</Text>
                <Text>Low: {`${rounding(row["1"]["04. low"])}`}</Text>
                <Text>
                  Volume: {`${longnumber(String(row["1"]["06. volume"]))}`}
                </Text>
                </View>
            ))}
            <View
              style={{
                borderRightWidth: 1,
                borderRadius: 1,
              }}
            ></View>
          </View>
          <View style={{ paddingRight: 20 }}>
            <Text>P/E: {rounding(props.profile.PERatio)}</Text>
            <Text>
              Mkt Cap: {longnumber(String(props.profile.MarketCapitalization))}
            </Text>
            <Text>P/EG: {rounding(props.profile.PEGRatio)}</Text>
            <Text>52W H: {rounding(props.profile["52WeekHigh"])}</Text>
          </View>
          <View style={{ paddingRight: 20 }}>
            <Text>52W L: {rounding(props.profile["52WeekLow"])}</Text>
            <Text>Yield: {rounding(props.profile["DividendYield"])}</Text>
            <Text>Beta: {rounding(props.profile["Beta"])}</Text>
            <Text>EPS: {rounding(props.profile["EPS"])}</Text>
          </View>
        </ScrollView>
      </View>
    </>
  );
}
