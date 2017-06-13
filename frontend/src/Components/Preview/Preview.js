import React from 'react';

import './Preview.css';

class Preview extends React.Component {
    constructor() {
        super();

        this.state = {
            url: 'http://placehold.it/300x300'
        };

        this.getGif = this.getGif.bind(this);
    }

    componentDidMount() {
        this.getGif();
    }

    getGif() {
        var url = 'http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=waiting';


        fetch(url, { method: 'GET' })
        .then(response => {
            if (!response.ok) {
                throw Error(response.error);
            }

            return response.json();
        })
        .then(result => {
            this.setState({ url: result.data.image_url });
        })
    }

    render() {
        return(
            <div>
                <img src={this.state.url} alt="some waiting gif"/>
            </div>
        )
    }
}

export default Preview;
