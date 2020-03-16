import React, { useState, useEffect } from "react";
import axios from "axios";
import WeatherInfo from "./WeatherInfo";

const Weather = ({ query }) => {
  const [condition, setCondition] = useState({});
  const [hasCondition, setHasCondition] = useState(false);

  const key = process.env.REACT_APP_OPENWEATHERMAP_KEY || null;

  const params = {
    q: query,
    APPID: key,
  };

  const updateCondition = () => {
    if (!key) return;

    let source = axios.CancelToken.source();

    axios
      .get("http://api.openweathermap.org/data/2.5/weather", {
        params: params,
        cancelToken: source.token,
      })
      .catch((error) => {
        if (axios.isCancel(error)) {
          console.log("Request canceled", error.message);
        } else {
          throw error;
        }
      })
      .then((response) => {
        if (response.statusText === "OK") {
          setCondition(response.data);
          setHasCondition(true);
        }
      })
      .catch((error) => {
        console.log(error.config);
      });

    return () => {
      source.cancel("Weather component is unmounting");
    };
  };
  useEffect(updateCondition, []);

  return <div>{hasCondition && <WeatherInfo condition={condition} />}</div>;
};

export default Weather;
