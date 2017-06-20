import React from 'react';

import './Preview.css';


const Preview = (props)  => {
    let downloadClassName = (props.customImage) ? 'download_button active' : 'download_button';

    return(
        <div>
            <img src={props.url} alt="some waiting gif" className="preview_image"/>
            <a href={props.url} download="test.gif" className={downloadClassName}>download</a>
        </div>
    )
}

export default Preview;
