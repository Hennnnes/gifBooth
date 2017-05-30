import React from 'react';
import './Controls.css';

class Controls extends React.Component {
    constructor() {
        super();

        this.loadPath = this.loadPath.bind(this);

        this.state = {
            path: ''
        }
    }

    loadPath() {
        fetch('http://raspi11.local:8080/expose')
        .then(response => {
          if (!response.ok) {
            throw Error(response.error);
          }

          return response.json();
        })
        .then(result => {
            console.log(result.path);
            this.setState({path: `http://raspi11.local/server/${result.path}`});
        })
        .catch(error => {
          console.log('error');
        })
    }

    render() {
        return (
            <div>
                <button className="btn" onClick={this.loadPath}>Create gif</button>

                <img src={this.state.path} />
            </div>
        );
    }
}

export default Controls;
