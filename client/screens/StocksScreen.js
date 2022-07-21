import React from "react";
import {
  StyleSheet,
  View /* include other react-native components here as needed */,
} from "react-native";
import LoadingScreen from "./LoadingScreen";
import { Text } from "react-native";
import Graph from "../components/Graph";
import useGraphAPI from "../API/graph";
import { Title, Subheading } from "react-native-paper";
import StockInfo from "../components/StockInfo";
import HeadingInfo from "../components/HeadingInfo";

export default function StocksScreen(props) {
  const { graphloading, graph, grapherror } = useGraphAPI(props.profile.Symbol);

  // From React navite docs https://reactnative.dev/docs/button
  const Separator = () => <View style={styles.separator} />;

  if (graphloading) {
    return <LoadingScreen />;
  }

  //Error Checking
  let a = Object.values(props.profile).flat();

  //If length is 1, means an error occured therefore message is displayed
  if (a.length == 1) {
    return (
      <>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Title>Stock Information Unavailable.</Title>
          <Subheading>
            There may be a problem with the server or network. Please try again
            later.
          </Subheading>
        </View>
      </>
    );
  }

  return (
    <View>
      <HeadingInfo overview={props.overview} profile={props.profile} />
      <Graph graph={graph["Time Series (Daily)"]} />
      <StockInfo overview={props.overview} profile={props.profile} />
      <Separator />
      <Text style={{ fontSize: 12 }}>{props.profile.Description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
  separator: {
    marginVertical: 8,
    borderBottomColor: "#737373",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
