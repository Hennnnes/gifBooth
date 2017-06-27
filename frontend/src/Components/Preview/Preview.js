import React from 'react';

import './Preview.css';
import Loader from '../Loader/Loader.js';


const Preview = (props)  => {
    let downloadClassName = (props.customImage) ? 'download_button active' : 'download_button';

    return(
        <div className="preview_wrapper">
          {props.visible ? <Loader /> :  <img src={props.url} alt="some waiting gif" className="preview_image"/>}
          {/* <img src={props.url} alt="some waiting gif" className="preview_image"/> */}
          <a href={props.url} download="test.gif" className={downloadClassName}>download</a>
        </div>
    )
}

export default Preview;
