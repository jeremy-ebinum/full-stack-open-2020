import React, { useRef } from "react";
import { useUIDSeed } from "react-uid";
import { setFilter, clearFilter } from "../reducers/filterReducer";
import {
  FilterInput,
  FilterLabel,
  FilterContainer,
  ClearFliterButton,
} from "./Styles";

const Filter = ({ store }) => {
  const seed = useUIDSeed();
  const ref = useRef();

  const handleChange = (event) => {
    store.dispatch(setFilter(event.target.value));
  };

  const clear = () => {
    store.dispatch(clearFilter());
    ref.current.value = "";
  };

  return (
    <FilterContainer>
      <FilterLabel htmlFor={seed("filter")}>Search</FilterLabel>
      <FilterInput
        ref={ref}
        id={seed("filter")}
        aria-label="Enter search filter"
        onChange={handleChange}
      />
      <ClearFliterButton onClick={clear}>Clear Filter</ClearFliterButton>
    </FilterContainer>
  );
};

export default Filter;
