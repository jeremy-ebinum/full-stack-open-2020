import React, { useRef } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { useUIDSeed } from "react-uid";
import { setFilter, clearFilter } from "../reducers/filterReducer";
import {
  FilterInput,
  FilterLabel,
  FilterContainer,
  ClearFliterButton,
} from "./StyledComponents";

const Filter = ({ setFilter, clearFilter }) => {
  const seed = useUIDSeed();
  const filterInputRef = useRef();

  const handleChange = (event) => {
    setFilter(event.target.value);
  };

  const clear = () => {
    clearFilter();
    filterInputRef.current.value = "";
  };

  return (
    <FilterContainer>
      <FilterLabel htmlFor={seed("filter")}>Search</FilterLabel>
      <FilterInput
        ref={filterInputRef}
        id={seed("filter")}
        aria-label="Enter search filter"
        onChange={handleChange}
      />
      <ClearFliterButton onClick={clear}>Clear Filter</ClearFliterButton>
    </FilterContainer>
  );
};

Filter.propTypes = {
  setFilter: PropTypes.func.isRequired,
  clearFilter: PropTypes.func.isRequired,
};

export default connect(null, { setFilter, clearFilter })(Filter);
