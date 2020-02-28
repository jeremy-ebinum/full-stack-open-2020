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
  const reduceToUpdateLoadingStates = (acc, loading) => {
    if (loading[0] === "isInitLoading") {
      return acc;
    }

    const loadingState = { [`${loading[0]}`]: loading[1] };

    return acc.concat(loadingState);
  };

  const loadingStates = Object.entries(state.loading).reduce(
    reduceToUpdateLoadingStates,
    []
  );

  const isLoading = loadingStates.some((loading) => Object.values(loading)[0]);

  return { isLoading };
};

export default connect(mapStateToProps)(ProgressBar);
