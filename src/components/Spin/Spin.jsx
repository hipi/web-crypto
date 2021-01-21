import React, { useState } from "react";
import "./Spin.scss";
function Spin(props) {
    return (
        <div className="spin-nested-loading">
            {
                props.spinning &&
                <div className="spin spin-spinning">
                    <span className="spin-dot spin-dot-spin">
                        <i className="spin-dot-item"></i>
                        <i className="spin-dot-item"></i>
                        <i className="spin-dot-item"></i>
                        <i className="spin-dot-item"></i>
                    </span>
                </div>
            }
            <div className={`spin-container ${props.spinning ? 'spin-blur' : ''} `}>
                {
                    props.children
                }
            </div>
        </div>
    );
}
export default Spin;
