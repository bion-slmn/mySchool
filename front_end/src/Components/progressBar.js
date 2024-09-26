import React from "react";
import "../styles/progressbar.css";

const ProgressBar = (props) => {
  const { completed } = props;
  let bgcolor;

  if (completed <= 30) {
    bgcolor = "#E92727";
  } else if (completed > 30 && completed <= 60) {
    bgcolor = "orange";
  } else {
    bgcolor = "#30CB00";
  }

  return (
    <div className="progress-container">
      <div
        className="progress-filler"
        style={{ width: `${completed}%`, backgroundColor: bgcolor }}
      >
        <span className="progress-label">{`${completed}%`}</span>
      </div>
    </div>
  );
};

export default ProgressBar;
