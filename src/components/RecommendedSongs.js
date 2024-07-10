import React from "react";

const songs = [
  {
    title: "Blank Space",
    artist: "Taylor Swift",
    img: "https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/ea61baa7-9c4b-4f43-805e-81de5fc8aa2b",
    duration: "4:33",
  },
  {
    title: "One Dance",
    artist: "Drake",
    img: "https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/6f72f702-c049-46fe-af76-a3b188b9a909",
    duration: "4:03",
  },
  {
    title: "Pawn It All",
    artist: "Alicia Keys",
    img: "https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/ad2e664a-3ab9-4f30-933a-623e26999030",
    duration: "3:10",
  },
];

const RecommendedSongs = () => {
  return (
    <div className="recommended-songs mt-5">
      <h1>Users</h1>
      <div className="song-container">
        {songs.map((song, index) => (
          <div className="song" key={index}>
            <div className="song-img">
              <img src={song.img} alt={song.title} />
              <div className="overlay">
                <i className="fa-solid fa-play"></i>
              </div>
            </div>
            <div className="song-title">
              <h2>{song.title}</h2>
              <p>{song.artist}</p>
            </div>
            <span>{song.duration}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedSongs;
