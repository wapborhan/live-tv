"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Loader from "./shared/loading/Loader";

const BanglaChannel = () => {
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
    <div className="slider-containers pb-10">
      <h1>Deshi Channel</h1>
      {bdCHannel.length > 0 ? (
        <div className="swiper-containers grid grid-cols-4">
          {bdCHannel.slice(0, 12).map((item) => {
            // console.log(item);
            return (
              <Link href={`channel/${item.id}`} key={item.id}>
                <div className="rounded-lg">
                  <div className="slide-overlays rounded-lg">
                    <div className="!w-32 !h-32">
                      <Image
                        src={item.logo}
                        width={100}
                        height={100}
                        alt={item.name}
                        className="!w-full !h-full border-none p-3 !object-contain"
                      />
                    </div>
                    <h2>{item.name}</h2>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default BanglaChannel;
