import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
  useContext,
} from "react";

import { Fragment } from "react/cjs/react.production.min";
import { Title, Text, Subheading } from "react-native-paper";
import useProfileAPI from "../API/profile";
import useListAPI from "../API/list";
import WatchListContext from "../contexts/WatchListContext";
import LoadingScreen from "./LoadingScreen";
import EmailContext from "../contexts/EmailContext";
import useOverviewAPI from "../API/overview";
import TokenContext from "../contexts/TokenContext";
import { Button, Card } from "react-native-paper";
import {
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import AsyncStorage from "@react-native-async-storage/async-storage";
import StocksScreen from "./StocksScreen";
import pctColour from "../components/utils/percentageColours";

const WatchlistScreen = ({ navigation }) => {
  const [watchList, setWatchList] = useContext(WatchListContext);
  const [key, setKey] = useContext(EmailContext);
  const [token, setToken] = useContext(TokenContext);
  const [stock, setStock] = useState("");
  const [hidden, setHidden] = useState(true);
  const { profileloading, profile, profileerror } = useProfileAPI(stock);
  const { overviewloading, overview, overviewerror } = useOverviewAPI(stock);
  const { listloading, list, listerror } = useListAPI(watchList);
  const [aa, setAa] = useState([]);

  // hooks
  const sheetRef = useRef(null);

  // variables
  const snapPoints = useMemo(() => ["99%"], []);

  // callbacks
  const handleSheetChange = useCallback((index) => {
    console.log("handleSheetChange", index);
  }, []);
  const handleSnapPress = useCallback((index) => {
    sheetRef.current?.snapToIndex(index);
  }, []);

  const Item = ({ item }) => (
    <>
      <TouchableOpacity>
        <Card onPress={() => dosomething(item["title"])}>
          <Card.Content style={{ justifyContent: "space-between" }}>
            <Title>{item["title"]}</Title>
            <Subheading>{`$${parseFloat(item["c"]).toFixed(2)}`}</Subheading>
          </Card.Content>

          <Card.Actions style={{ justifyContent: "space-between" }}>
            <Text style={{ color: pctColour(parseFloat(item["dp"])) }}>
              {"  "}
              {`${parseFloat(item["dp"]).toFixed(2)}%`}
            </Text>
            <Button
              // Remove stock from DB & Watchlist
              onPress={() => remove(item["title"])}
              icon="trash-can-outline"
            ></Button>
          </Card.Actions>
        </Card>
      </TouchableOpacity>
    </>
  );

  const renderItem = ({ item }) => {
    return <Item item={item} />;
  };

  //Add stock title as element in watchlist data.
  let i = 0;
  Object.values(list || {}).forEach((object) => {
    object.title = watchList[i];
    i++;
  });

  //Returning error message if error occurs in any part
  if (profileerror || overviewerror || listerror) {
    return <Text>Error</Text>;
  }

  const getWatchList = async () => {
    const url = `${process.env.SERVER_LINK}/retrieve`;

    fetch(url, {
      method: "GET",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setWatchList(data))
      .catch((err) => console.log(err));
  };

  function remove(symbol) {
    //Removing from database
    const url = `${process.env.SERVER_LINK}/delete`;
    fetch(url, {
      method: "DELETE",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ symbol: symbol }),
    })
      .then((res) => res.json())
      .catch((err) => console.log(err));

    //Filtering the selected symbol out of watchlist
    let removeditemList = watchList.filter((e) => e !== symbol);
    //Settnig the new watchlist as state
    setWatchList(removeditemList);
  }

  function dosomething(symbol) {
    //Changing stock symbol to used for profile and overview
    setStock(symbol);
    //Opens bottom sheet
    handleSnapPress(0);
    //Reveals bottom sheet
    setHidden(false);
  }

  //View loading screen if any parts are loading from server
  if (profileloading || overviewloading || listloading) {
    return <LoadingScreen />;
  }

  useEffect(() => {
    //Gets watchlist on load
    getWatchList();
  }, []);

  return (
    <Fragment>
      {/* Hiding watchlist depending on state  */}
      {hidden === true ? null : (
        <BottomSheet
          ref={sheetRef}
          snapPoints={snapPoints}
          onChange={handleSheetChange}
          enablePanDownToClose
        >
          <BottomSheetView>
            <StocksScreen profile={profile} overview={overview} />
          </BottomSheetView>
        </BottomSheet>
      )}

      {/* If the user isn't watching any stocks, message will appear */}
      {watchList.length == 0 ? (
        <>
          <SafeAreaView
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Title>Your not watching any stocks!</Title>
            <Subheading>
              Click a stock from the search menu to start watching!
            </Subheading>
          </SafeAreaView>
        </>
      ) : (
        <>
          {/* Returning watchlist, if any */}
          <SafeAreaView style={styles.container}>
            <FlatList
              data={Object.values(list || {})}
              renderItem={renderItem}
              key={(item) => item["title"]}
            />
          </SafeAreaView>
        </>
      )}
    </Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    zIndex: -1,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    zIndex: -1,
  },
  app: {
    backgroundColor: "white",
  },
});

export default WatchlistScreen;
