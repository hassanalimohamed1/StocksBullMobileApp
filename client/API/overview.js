import { useState, useEffect } from "react";


async function getData(search) {
  const url = `${process.env.GQ_LINK}${search}&apikey=${process.env.GQ_LINK_API_KEY}`;
  let res = await fetch(url);
  let data = await res.json();
  return data;
}
export default function useOverviewAPI(search) {
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setOverview(await getData(search));
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    })();
  }, [search]);
  return {
    loading,
    overview,
    error,
  };
}
