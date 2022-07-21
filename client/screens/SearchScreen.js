import React, { useState, useEffect, useContext } from "react";

import { StyleSheet } from "react-native";

import { FlatList, SafeAreaView, TouchableOpacity, Text } from "react-native";

import LoadingScreen from "./LoadingScreen";
import TokenContext from "../contexts/TokenContext";
import { Searchbar, Card } from "react-native-paper";
import useTableAPI from "../API/stocks";
import WatchListContext from "../contexts/WatchListContext";
import { Snackbar } from "react-native-paper";
import EmailContext from "../contexts/EmailContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SearchScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [stock, setStock] = useState("");
  const [token, setToken] = useContext(TokenContext);
  const [visible, setVisible] = React.useState(false);
  const [visible1, setVisible1] = React.useState(false);
  const [watchList, setWatchList] = useContext(WatchListContext);
  const [email, setEmail] = useContext(EmailContext);
  const { loading, table, error } = useTableAPI();
  const [filteredStocks, setFilteredStocks] = useState([]);

  const onChangeSearch = (query) => setSearchQuery(query);
  const onToggleSnackBar = () => setVisible(!visible);
  const onDismissSnackBar = () => setVisible(false);
  const onToggleSnackBar1 = () => setVisible1(!visible1);
  const onDismissSnackBar1 = () => setVisible1(false);

  function add(symbol) {
    //Pushing the new symbol in to the watchlist
    const newwatchlist = [...watchList, symbol];
    //storing the new watchlist to async storage
    storeData(newwatchlist);
    //setting the new watch list in state
    setWatchList(newwatchlist);
  }

  //Adding to the database
  function update(symbol) {
    fetch(`${process.env.SERVER_LINK}/update`, {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ watchlist: symbol }),
    })
      .then((res) => res.json())
      .catch((err) => console.log(err));
  }

  //Storing to async storage
  const storeData = async (value) => {
    try {
      const watchList = JSON.stringify(value);
      await AsyncStorage.setItem(email, watchList);
    } catch (e) {
      console.log(e);
    }
  };

  function remove(symbol) {
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

    //Filtering the symbol out of the watchlist
    let removeditemList = watchList.filter((value) => value !== symbol);

    //setting the new watch list in state
    setWatchList(removeditemList);
  }

  const Item = ({ item, onPress }) => (
    <>
      <TouchableOpacity onPress={onPress}>
        <Card onPress={() => dosomething(item["1"]["symbol"])}>
          <Card.Title
            title={item["1"]["name"] + " " + "(" + item["1"]["symbol"] + ")"}
            subtitle={item["1"]["sector"]}
          />
        </Card>
      </TouchableOpacity>
    </>
  );

  const renderItem = ({ item }) => {
    return <Item item={item} key={item["1"]["name"]} />;
  };

  function dosomething(symbol) {
    //Checking if the symbol is already in the watchlist
    if (watchList.includes(symbol)) {
      //If so, shows the 'already added' snackbar
      onToggleSnackBar1();
      return;
    } else {
      // if not, changes stock symbol for adding to db/storage & shows snackbar
      setStock(symbol);
      onToggleSnackBar();
      update(symbol);
      add(symbol);
    }
  }

  useEffect(() => {
    setFilteredStocks(
      table.filter(
        (row) =>
          row.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
          row.sector.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery]);

  //Data is loading
  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Searchbar
        placeholder="Search"
        onChangeText={onChangeSearch}
        value={searchQuery}
      />

      {/* Returning a message to the user that their search doesn't exsit  */}

      {filteredStocks.length == 0 && filteredStocks != [] ? (
        <SafeAreaView
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text>No Results for "{searchQuery}"</Text>
        </SafeAreaView>
      ) : null}

      {/* If server error occurs, the array will return with a length of 0/1, therefore giving a message to the user */}
      {Object.values(table).flat().length == 1 ||
      Object.values(table).flat().length == 0 ? (
        <>
          <SafeAreaView
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Title>Search Unavailable.</Title>
            <Subheading>
              There may be a problem with the server or network. Please try
              again later.
            </Subheading>
          </SafeAreaView>
        </>
      ) : (
        <>
          <SafeAreaView style={styles.container}>
            <FlatList
              data={Object.entries(filteredStocks)}
              renderItem={renderItem}
              key={(item) => item["1"]["name"]}
              extraData={selectedId}
            />
          </SafeAreaView>

          {/* The Added to watchlist snackbar */}
          <Snackbar
            visible={visible}
            onDismiss={onDismissSnackBar}
            action={{
              label: "Undo",
              onPress: () => {
                // Remove stock from DB & Watchlist
                remove(stock);
              },
            }}
          >
            Added to Watchlist.
          </Snackbar>

          {/* The Already added to watchlist snackbar */}
          <Snackbar visible={visible1} onDismiss={onDismissSnackBar1}>
            Symbol already added to watchlist.
          </Snackbar>
        </>
      )}
    </>
  );
}

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
});
