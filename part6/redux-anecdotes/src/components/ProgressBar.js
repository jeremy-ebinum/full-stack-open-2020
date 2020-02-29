import React from "react";
import { connect } from "react-redux";
import { Meter, MeterBar } from "./Styles";

const ProgressBar = (props) => {
  const { isLoading } = props;

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

export default connect(mapStateToProps)(ProgressBar);
