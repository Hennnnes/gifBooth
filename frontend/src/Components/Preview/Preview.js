import React from 'react';

import './Preview.css';


const Preview = (props)  => {
    return(
        <div>
            <img src={props.url} alt="some waiting gif" className="preview_image"/>
        </div>
    )
}

export default Preview;
