import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { client } from "../client";

import { searchQuery, feedQuery } from "../utils/data";
import { MasonryLayout, Spinner } from "../components";

const Feed = () => {
  const [loading, setloading] = useState(false);
  const [pins, setPins] = useState(null);
  const { categoryId } = useParams();

  useEffect(() => {
    setloading(true);
    if (categoryId) {
      const query = searchQuery(categoryId);
      client.fetch(query).then((data) => {
        setPins(data);
        setloading(false);
      });
    } else {
      client.fetch(feedQuery).then((data) => {
        console.log(data);
        setPins(data);
        setloading(false);
      });
    }

    return () => {};
  }, [categoryId]);

  if (loading) return <Spinner message="We are adding data to your feed!" />;

  return (
    <div className="h-full" style={{ height: "100%" }}>
      {pins?.length > 0 ? (
        <MasonryLayout pins={pins} />
      ) : (
        <div className="flex flex-col items-center justify-center h-full">
          <h1 className="text-2xl font-bold text-gray-500">No Pins Found</h1>
          <p className="text-gray-500">Try searching for something else</p>
        </div>
      )}
    </div>
  );
};

export default Feed;
