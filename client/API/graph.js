import { useState, useEffect } from "react";

async function getData(search) {
  const url = `${process.env.TSD_LINK}${search}&apikey=${process.env.TDS_API_KEY}`;
  let res = await fetch(url);
  let data = await res.json();
  return data;
}

export default function useGraphAPI(search) {
  const [loading, setLoading] = useState(true);
  const [graph, setGraph] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setGraph(await getData(search));
        setLoading(false);
      } catch (err) {
        setError(error);
        setLoading(false);
      }
    })();
  }, [search]);
  return {
    loading,
    graph,
    error,
  };
}
