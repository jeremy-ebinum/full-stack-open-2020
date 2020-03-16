import React from "react";
import Weather from "./Weather";

const Country = ({ country }) => {
  const languagesList = country.languages.map((lang) => {
    return <li key={lang.iso639_2}>{lang.name}</li>;
  });

  const timezonesList = country.timezones.map((tz, idx) => {
    return <span key={idx}>{tz} | </span>;
  });

  return (
    <div>
      <h2>{country.name}</h2>

      <div>
        <span>
          <strong>Capital: </strong>
          {country.capital}
        </span>
        <br />
        <span>
          <strong>Population: </strong>
          {country.population}
        </span>
        <br />
        <span>
          <strong>Region: </strong>
          {country.region}
        </span>
        <br />
        <span>
          <strong>Sub Region: </strong>
          {country.subregion}
        </span>
        <br />
        <span>
          <strong>Timezones: </strong>
          {timezonesList}
        </span>
        <br />
      </div>

      <div>
        <h3>Languages</h3>
        <ul>{languagesList}</ul>
      </div>

      <div>
        <img alt={"Country Flag"} width={"200px"} src={country.flag}></img>
      </div>

      <Weather query={country.capital + "," + country.alpha2Code} />
    </div>
  );
};

export default Country;
