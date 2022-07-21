import React, { useEffect, useState } from "react";

import dateConverter from "./utils/dateConverter";
import { LineChart } from "react-native-chart-kit";
import { Dimensions} from "react-native";
import { Button } from "react-native-paper";
import { Title, Subheading } from "react-native-paper";
import {
  View,
} from "react-native";

export default function Graph(props) {
    //random data from react-native-chart-kit to prevent error 
  const [filteredPrices, setFilteredPrices] = useState([
    Math.random() * 100,
    Math.random() * 100,
    Math.random() * 100,
    Math.random() * 100,
    Math.random() * 100,
    Math.random() * 100,
  ]);
  const [selectedDate, setSelectedDate] = useState(initialDate);

  //Making the iniital date
  const i = new Date().toISOString().split("T")[0];
  const initialDate = String(i);


  useEffect(() => {
    setFilteredPrices(
      Object.entries(props.graph || {})
        .filter((row) => row["0"] >= selectedDate)
        .reverse()
        .map((row) => Number(row["1"]["4. close"]))
    );
  }, [selectedDate, props.graph]);

  return (
    <>
      <View>
        <View style={{ flexDirection: "row" }}>

          {/* Buttons that users click on to change dates  */}
          <Button onPress={() => setSelectedDate(dateConverter(2))}>1D</Button>
          <Button onPress={() => setSelectedDate(dateConverter(7))}>7D</Button>
          <Button onPress={() => setSelectedDate(dateConverter(14))}>2W</Button>
          <Button onPress={() => setSelectedDate(dateConverter(30))}>1M</Button>
          <Button onPress={() => setSelectedDate(dateConverter(90))}>3M</Button>
          <Button onPress={() => setSelectedDate(dateConverter(100))}>
            MAX
          </Button>
        </View>
        <View
          style={{ flexDirection: "row", marginBottom: -30, marginLeft: 8 }}
        >

           {/* // If the graph information cannot be retrieved, show error page */}
          {props.graph === undefined || filteredPrices.length === 0 ? (
            <View
              style={{
                marginBottom: 30,
                marginLeft: -8,
                paddingBottom: 20,
                paddingTop: 20,
                justifyContent: "center",
              }}
            >
              {/* Error Screen */}
              <Title>Graph Unavailable.</Title>
              <Subheading>
                There may be a problem with the server or network. Please try
                again later.
              </Subheading>
            </View>
          ) : (
            //   else, show the graph
            <LineChart
              data={{
                datasets: [
                  {
                    data: filteredPrices,
                  },
                ],
              }}
              width={Dimensions.get("window").width} // from react-native
              height={250}
              yAxisLabel="$"
              yAxisInterval={2} // optional, defaults to 1
              chartConfig={{
                backgroundColor: "#ffffff",
                backgroundGradientFrom: "#ffffff",
                backgroundGradientTo: "#ffffff",
                decimalPlaces: 2, // optional, defaults to 2dp
                color: (opacity = 0) => `rgba(47, 204, 113, ${opacity})`,
                labelColor: (opacity = 0) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: "1",
                  strokeWidth: "2",
                  stroke: "green",
                },
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
            />
          )}
        </View>
      </View>
    </>
  );
}
