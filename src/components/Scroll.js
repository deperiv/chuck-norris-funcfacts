import React from "react";
import '../containers/App.css'

const Scroll = (props) => {
    return (
        <div className = "factlist-dec scrollWrapper">
            {props.children}
        </div>
    )
}

export default Scroll;
