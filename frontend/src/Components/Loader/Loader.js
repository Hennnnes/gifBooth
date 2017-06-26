import React from 'react';
import './Loader.css';

const Loader = (props) => {
    return(
        <div className={(props.visible) ? 'loader visible': 'loader hidden'}>Loading</div>
    )
}

export default Loader;
