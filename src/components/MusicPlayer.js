"use client";
import { usePathname } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";

const songs = [
  {
    title: "Redemption",
    name: "Besomorph & Coopex",
    source:
      "https://github.com/ecemgo/mini-samples-great-tricks/raw/main/song-list/Besomorph-Coopex-Redemption.mp3",
    cover:
      "https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/398875d0-9b9e-494a-8906-210aa3f777e0",
  },
  {
    title: "What's The Problem?",
    name: "OSKI",
    source:
      "https://github.com/ecemgo/mini-samples-great-tricks/raw/main/song-list/OSKI-Whats-The-Problem.mp3",
    cover:
      "https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/810d1ddc-1168-4990-8d43-a0ffee21fb8c",
  },
  {
    title: "Control",
    name: "Unknown Brain x Rival",
    source:
      "https://github.com/ecemgo/mini-samples-great-tricks/raw/main/song-list/Unknown-BrainxRival-Control.mp3",
    cover:
      "https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/7bd23b84-d9b0-4604-a7e3-872157a37b61",
  },
];

const MusicPlayer = () => {
  const pathname = usePathname();

  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef(null);
  const rotationRef = useRef(null);
  const rotatingImageRef = useRef(null);
  const [currentRotation, setCurrentRotation] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const updateProgress = () => {
        setProgress(audio.currentTime);
      };

      audio.addEventListener("timeupdate", updateProgress);
      audio.addEventListener("ended", handleNext);

      return () => {
        audio.removeEventListener("timeupdate", updateProgress);
        audio.removeEventListener("ended", handleNext);
      };
    }
  }, [currentSongIndex]);

  const handleNext = () => {
    setCurrentSongIndex((currentSongIndex + 1) % songs.length);
  };

  const handlePrev = () => {
    setCurrentSongIndex((currentSongIndex - 1 + songs.length) % songs.length);
  };

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (audio) {
      if (isPlaying) {
        audio.pause();
        stopRotation();
      } else {
        audio.play();
        startRotation();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const startRotation = () => {
    if (!rotationRef.current) {
      rotationRef.current = setInterval(() => {
        setCurrentRotation((prev) => prev + 1);
      }, 50);
    }
  };

  const stopRotation = () => {
    if (rotationRef.current) {
      clearInterval(rotationRef.current);
      rotationRef.current = null;
    }
  };

  useEffect(() => {
    if (rotatingImageRef.current) {
      rotatingImageRef.current.style.transform = `rotate(${currentRotation}deg)`;
    }
  }, [currentRotation]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.src = songs[currentSongIndex].source;
      setProgress(0);
      if (isPlaying) {
        audio.play();
      }
    }
  }, [currentSongIndex]);

  // console.log(pathname);

  return (
    <div className="music-player">
      <div className="album-cover">
        <img
          ref={rotatingImageRef}
          src={songs[currentSongIndex].cover}
          alt=""
        />
        <span className="point"></span>
      </div>

      <h2>{songs[currentSongIndex].title}</h2>
      {/* <p>{songs[currentSongIndex].name}</p> */}

      <audio ref={audioRef}>
        <source src={songs[currentSongIndex].source} type="audio/mpeg" />
      </audio>

      <input
        type="range"
        value={progress}
        max={audioRef.current?.duration || 0}
        onChange={(e) => {
          if (audioRef.current) {
            audioRef.current.currentTime = Number(e.target.value);
            setProgress(Number(e.target.value));
          }
        }}
      />

      <div className="controls">
        <button className="backward" onClick={handlePrev}>
          <i className="fa-solid fa-backward"></i>
        </button>
        <button className="play-pause-btn" onClick={handlePlayPause}>
          <i
            className={`fa-solid ${isPlaying ? "fa-pause" : "fa-play"}`}
            id="controlIcon"
          ></i>
        </button>
        <button className="forward" onClick={handleNext}>
          <i className="fa-solid fa-forward"></i>
        </button>
      </div>
    </div>
  );
};

export default MusicPlayer;
