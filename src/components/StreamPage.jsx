"use client";
import { useEffect, useState } from "react";
import Player from "../components/Player";

const StreamPage = ({ id }) => {
  const [streamLink, setStreamLink] = useState([]);

  useEffect(() => {
    fetch("https://iptv-org.github.io/api/streams.json")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setStreamLink(data);
      });
  }, []);

  const link = streamLink.find((item) => item.channel === id);
  return (
    <div>
      <div className="channel">
        <h1 className="text-4xl pb-5">
          Channel: <sapn className=" font-bold ">{link?.channel}</sapn>{" "}
        </h1>
      </div>
      {link ? (
        <>
          <Player streamUrl={link?.url} />
        </>
      ) : (
        "No Stream Link Found"
      )}
    </div>
  );
};

export default StreamPage;
