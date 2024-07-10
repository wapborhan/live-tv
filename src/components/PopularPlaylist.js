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

const PopularPlaylist = () => {
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
    <div className="slider-container pb-10">
      <h1>Deshi Channel</h1>
      {bdCHannel.length > 0 ? (
        <div className="swiper-container">
          <Swiper
            effect="coverflow"
            grabCursor={true}
            centeredSlides={true}
            loop={true}
            speed={600}
            slidesPerView="auto"
            coverflowEffect={{
              rotate: 10,
              stretch: 120,
              depth: 200,
              modifier: 1,
              slideShadows: false,
            }}
            modules={[EffectCoverflow, Pagination]}
            pagination={{
              dynamicBullets: true,
            }}
          >
            {bdCHannel.slice(0, 15).map((item) => {
              // console.log(item);
              return (
                <SwiperSlide key={item.id} className="rounded-lg">
                  <Image
                    width={1200}
                    height={1200}
                    src="/bg-cover.jpg"
                    alt={item.name}
                    className="bg-cover bg-bottom"
                  />
                  <div className="slide-overlay rounded-lg">
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
                    <Link
                      href={`channel/${item.id}`}
                      className="border p-3 rounded-md"
                    >
                      Watch Now <i className="fa-solid fa-circle-play"></i>
                    </Link>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default PopularPlaylist;
