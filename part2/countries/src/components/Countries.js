import React from "react";
import Country from "./Country";

const Countries = ({ countries }) => {
  const tooManyCountries = countries.length > 10;
  const multipleCountries = countries.length > 1 && countries.length <= 10;
  const singleCountry = countries.length === 1;

  const countriesList = countries.map(country => {
    return <div key={country.alpha3Code}>{country.name}</div>;
  });

  return (
    <div>
      {tooManyCountries && "Too many matches, specify another filter"}
      {multipleCountries && <div>{countriesList}</div>}
      {singleCountry && <Country country={countries[0]} />}
    </div>
  );
};

export default Countries;
