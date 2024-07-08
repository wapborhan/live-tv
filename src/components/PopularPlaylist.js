"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";

const PopularPlaylist = () => {
  return (
    <div className="slider-container pb-10">
      <h1>Popular Playlist</h1>
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
          <SwiperSlide>
            <img
              src="https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/95b52c32-f5da-4fe6-956d-a5ed118bbdd2"
              alt="Midnight Moods"
            />
            <div className="slide-overlay">
              <h2>Midnight Moods</h2>
              <button>
                Listen Now <i className="fa-solid fa-circle-play"></i>
              </button>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <img
              src="https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/95b52c32-f5da-4fe6-956d-a5ed118bbdd2"
              alt="Midnight Moods"
            />
            <div className="slide-overlay">
              <h2>Midnight Moods</h2>
              <button>
                Listen Now <i className="fa-solid fa-circle-play"></i>
              </button>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <img
              src="https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/95b52c32-f5da-4fe6-956d-a5ed118bbdd2"
              alt="Midnight Moods"
            />
            <div className="slide-overlay">
              <h2>Midnight Moods</h2>
              <button>
                Listen Now <i className="fa-solid fa-circle-play"></i>
              </button>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <img
              src="https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/95b52c32-f5da-4fe6-956d-a5ed118bbdd2"
              alt="Midnight Moods"
            />
            <div className="slide-overlay">
              <h2>Midnight Moods</h2>
              <button>
                Listen Now <i className="fa-solid fa-circle-play"></i>
              </button>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  );
};

export default PopularPlaylist;
