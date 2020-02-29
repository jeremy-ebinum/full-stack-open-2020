import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Meter, MeterBar } from "./StyledComponents";

const ProgressBar = ({ isLoading }) => {
  return (
    <>
      {isLoading && (
        <Meter toTop>
          <MeterBar></MeterBar>
        </Meter>
      )}
    </>
  );
};

const mapStateToProps = (state) => {
  const loadingStates = Object.entries(state.requests).map((entry) => {
    return { ...entry[1], requestName: entry[0] };
  });

  const isLoading = loadingStates.some((l) => {
    return l.requestName !== "initAnecdotes" && l.isLoading;
  });

  return { isLoading };
};

ProgressBar.propTypes = { isLoading: PropTypes.bool.isRequired };

export default connect(mapStateToProps)(ProgressBar);
