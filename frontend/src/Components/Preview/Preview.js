import React from 'react';

import './Preview.css';

class Preview extends React.Component {
    render() {
        return(
            <div>
                <img src={this.props.url} alt="some waiting gif" className="preview_image"/>
            </div>
        )
    }
}

export default Preview;
