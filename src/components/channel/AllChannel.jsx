"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const AllChannel = () => {
  const [channel, setChannel] = useState([]);

  useEffect(() => {
    fetch("/channels.json")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setChannel(data);
      });
  }, []);

  return (
    <div className="albumss">
      <h1>Recommended Albums</h1>
      <div className="album-containers grid grid-cols-4 containerss">
        {channel.slice(0, 100).map((album) => (
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
        ))}
      </div>
    </div>
  );
};

export default AllChannel;
