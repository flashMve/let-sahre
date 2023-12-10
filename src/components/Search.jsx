import React, { useState, useEffect } from "react";
import MasonryLayout from "./MasonryLayout";
import { client } from "../client";
import { feedQuery, searchQuery } from "../utils/data";
import Spinner from "./Spinner";

const Search = ({ searchTerm, setSearchTerm }) => {
  const [pins, setPins] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchTerm) {
      setLoading(true);
      const query = searchQuery(searchTerm);
      client.fetch(query).then((data) => {
        console.log(data);
        setPins(data);
        setLoading(false);
      });
    } else {
      setLoading(true);
      
      client.fetch(feedQuery).then((data) => {
        console.log(data);
        setPins(data);
        setLoading(false);
      });
    }
    return () => {};
  }, [searchTerm]);

  if (loading) return <Spinner message="We are adding data to your feed!" />;

  return (
    <div className="p-2">
      {pins?.length !== 0 && <MasonryLayout pins={pins} />}
      {pins?.length === 0 && searchTerm !== "" && !loading && (
        <div className="flex flex-col items-center justify-center h-full">
          <h1 className="text-2xl font-bold text-gray-500">No Pins Found</h1>
          <p className="text-gray-500">Try searching for something else</p>
        </div>
      )}
    </div>
  );
};

export default Search;
