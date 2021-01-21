import React, { useState } from "react";
import "./Process.scss";
function Process(props) {
  const percentNumber = props.percent ? props.percent > 100 ? 100 : props.percent : 0
  return (
    <div className="progress-line progress-status-active">
      <div className="progress-bg">
        <div
          className="progress-in"
          style={{
            width: `${percentNumber}%`,
            height: props.strokeWidth ? `${props.strokeWidth}px` : "10px",
            backgroundColor: props.strokeColor || "rgb(135, 208, 104)"
          }}
        ></div>
      </div>
      {props.showInfo && (
        <div className="percent-text">{props.percentNumber}%</div>
      )}
    </div>
  );
}
export default Process;
