"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Loader from "./shared/loading/Loader";
import Image from "next/image";

const RecommendedAlbums = () => {
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
    <div className="albums">
      <h1>Recommended Albums</h1>
      <div className="album-container containers">
        {channel.length > 0 ? (
          channel.slice(0, 50).map((album) => (
            <Link href={`channel/${album.id}`} key={album.id}>
              <div className="album">
                <div className="album-frame">
                  <Image
                    height={100}
                    width={100}
                    src={album.logo}
                    alt={album.title}
                  />
                </div>
                <div className="!no-underline">
                  <h2>{album.name}</h2>
                  <p>{album.city}</p>
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

export default RecommendedAlbums;
