import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
// import Player from "./components/Player";
// import log from "video.js/dist/types/utils/log";

function App() {
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
    <div className=" justify-center items-center h-screen w-screen">
      <div className="tv">
        <h1 className="text-2xl font-bold">Live TV List</h1>
      </div>
      <div className="channerlist flex flex-wrap gap-6">
        {channel
          ? channel.slice(0, 50).map((item) => {
              return (
                <>
                  <NavLink to={item?.id}>
                    <div className="channel border p-10" key={item?.id}>
                      <img src={item?.logo} alt="" />
                      <br />
                      {item?.name}
                    </div>
                  </NavLink>
                </>
              );
            })
          : "No Channer Found"}
      </div>
    </div>
  );
}

export default App;
