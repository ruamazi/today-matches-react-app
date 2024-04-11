import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./app.module.css";
import FetchDIrectyl from "./components/FetchDIrectyl";

function App() {
  const [datos, setDatos] = useState(null);
  const [loading, setLorading] = useState(true);
  const [isRunning, setIsRunning] = useState(false);

  const handleFetchFootball = async () => {
    setLorading(true);
    const options = {
      method: "GET",
      url: "https://football-results-of-today.p.rapidapi.com/today",
      headers: {
        "X-RapidAPI-Key": import.meta.env.VITE_API_KEY,
        "X-RapidAPI-Host": "football-results-of-today.p.rapidapi.com",
      },
    };
    const resp = await axios(options);
    const data = resp.data;
    setDatos(data);
    if (data) {
      setLorading(false);
    }
  };
  useEffect(() => {
    handleFetchFootball();
  }, []);
  console.log(datos);

  useEffect(() => {
    let intervalId;
    if (isRunning) {
      intervalId = setInterval(() => {
        handleFetchFootball();
      }, 30000);
    }
    return () => {
      clearInterval(intervalId);
    };
  }, [isRunning]);

  const handleAuto = () => {
    setIsRunning((prev) => !prev);
  };

  return (
    <div className={styles.container}>
      <h1>Matches Of Today</h1>
      <div className={styles.btnCont}>
        <button className={styles.btn} onClick={handleFetchFootball}>
          Update
        </button>
        <button className={isRunning ? styles.auto : ""} onClick={handleAuto}>
          Auto update is {isRunning ? "on" : "off"}
        </button>
      </div>

      {loading ? <p>Loading...</p> : ""}
      {datos?.map((item) => (
        <div key={item.id} className={styles.wrapper}>
          <h2>
            {item.competition}
            <img
              className={styles.compLogo}
              src={item.competitionLogo}
              alt=""
            />
          </h2>

          {item?.match?.map((itm) => (
            <div key={itm.matchId}>
              <div className={itm.live ? styles.live : styles.singleCon}>
                <div className={styles.teamAcon}>
                  <h3>
                    {itm.teamA} <img src={itm.teamALogo} alt="team A logo" />
                    <span>{itm.teamAResult}</span>{" "}
                    <span className={styles.dot}>
                      {itm.liveStatus
                        ? itm.liveStatus
                        : itm.startIn
                        ? itm.startIn
                        : "."}
                    </span>
                    <span>{itm.teamBResult}</span>
                    <img src={itm.teamBLogo} alt="team B logo" /> {itm.teamB}
                  </h3>
                </div>
                <div className={styles.teambcon}></div>
              </div>
            </div>
          ))}
        </div>
      ))}
      <FetchDIrectyl />
    </div>
  );
}

export default App;
