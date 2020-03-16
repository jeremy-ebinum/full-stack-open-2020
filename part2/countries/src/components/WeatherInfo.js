import React from "react";

const WeatherInfo = ({ condition }) => {
  const getWindCompassDirection = (inputDegree) => {
    const dirs1 = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE"];
    const dirs2 = ["S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW", "N"];
    // Create 16 sectors of 22.5deg each + one extra for 0deg and 360deg North
    const directionsArr = dirs1.concat(dirs2);

    // Restrict range to 360deg then divide by sector of 22.5deg to get index
    // Add 1 to adjust for zero indexed array
    const directionsIdx = Math.round((inputDegree % 360) / 22.5) + 1;
    const direction = directionsArr[directionsIdx];

    return direction;
  };

  const windDirection = getWindCompassDirection(condition.wind.deg);

  return (
    <>
      <h3>Weather in {condition.name}</h3>
      <div>
        <span>
          <strong>Description: </strong>
          {condition.weather[0].description}
        </span>
        <div>
          <img
            alt={"Weather icon"}
            src={`http://openweathermap.org/img/wn/${condition.weather[0].icon}@2x.png`}
          ></img>
        </div>
      </div>
      <div>
        <span>
          <strong>Temperature: </strong>
          {Math.round(condition.main.temp - 273.15)}&#8451;
        </span>
      </div>
      <div>
        <span>
          <strong>Wind: </strong>
          {condition.wind.speed}m/s {windDirection}
        </span>
      </div>
    </>
  );
};

export default WeatherInfo;
