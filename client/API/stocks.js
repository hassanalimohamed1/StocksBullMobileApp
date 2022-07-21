import { useState, useEffect } from "react";

async function getData() {
  const url = `${process.env.FMP_LINK}${process.env.FMP_LINK_API_KEY}`;
  let res = await fetch(url);
  let data = await res.json();

  return data;
}
export default function useTableAPI() {
  const [loading, setLoading] = useState(true);
  const [table, setTable] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setTable(await getData());
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    })();
  }, []);
  return {
    loading,
    table,
    error,
  };
}
