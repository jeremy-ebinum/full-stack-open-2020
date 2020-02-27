import React, { useRef } from "react";
import { connect } from "react-redux";
import { useUIDSeed } from "react-uid";
import { setFilter, clearFilter } from "../reducers/filterReducer";
import {
  FilterInput,
  FilterLabel,
  FilterContainer,
  ClearFliterButton,
} from "./Styles";

const Filter = (props) => {
  const seed = useUIDSeed();
  const ref = useRef();

  const handleChange = (event) => {
    props.dispatch(setFilter(event.target.value));
  };

  const clear = () => {
    props.dispatch(clearFilter());
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

export default connect()(Filter);
