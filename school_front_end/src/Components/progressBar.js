import React from "react";
import "../styles/progressbar.css";

const ProgressBar = (props) => {
  const { completed } = props;
  let bgcolor;

  if (completed <= 30) {
    bgcolor = "red";
  } else if (completed > 30 && completed <= 60) {
    bgcolor = "orange";
  } else {
    bgcolor = "green";
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
