import { useState, useEffect } from "react";

export default function useListAPI(watchlist) {
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);
  const [error, setError] = useState(null);

  let a = [];

  async function getData(watchlist) {
    let promises = watchlist.map((search) =>
      fetch(
        `${process.env.FB_LINK}${search}&token=${process.env.FB_API_KEY}`
      ).then((res) => res.json())
    );

    // Waiting for all promises, then adding them to state via an array
    Promise.all(promises).then((res) => setList((a = [...a, res].flat())));
  }

  useEffect(() => {
    (async () => {
      try {
        setList(await getData(watchlist));
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    })();
  }, [watchlist]);
  return {
    loading,
    list,
    error,
  };
}
