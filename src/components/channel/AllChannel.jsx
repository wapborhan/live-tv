"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Loader from "../shared/loading/Loader";

const AllChannel = () => {
  const [channel, setChannel] = useState([]);

  useEffect(() => {
    fetch("/channels.json")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setChannel(data);
      });
  }, []);
  const bdCHannel = channel.filter((item) => item.country === "BD");

  return (
    <div className="albumss">
      <h1>Recommended Albums</h1>
      <div className="album-containers grid grid-cols-4 containerss mt-7 w-100">
        {channel.length > 0 ? (
          channel.slice(0, 100).map((album) => (
            <Link href={`channel/${album?.id}`} key={album?.id}>
              <div className="album">
                <div className="album-frame">
                  <Image
                    width={100}
                    height={100}
                    src={album?.logo}
                    alt={album?.title}
                  />
                </div>
                <div className="!no-underline">
                  <h2>{album?.name}</h2>
                  <p>{album?.city}</p>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <Loader />
        )}
      </div>
    </div>
  );
};

export default AllChannel;
