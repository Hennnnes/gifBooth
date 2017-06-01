import React from 'react';
import './Controls.css';

class Controls extends React.Component {
    constructor() {
        super();

        this.loadPath = this.loadPath.bind(this);
        this.forceUpdate = this.forceUpdate.bind(this);

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
            this.setState({path: `http://raspi11.local:8080/${result.path}`});
		this.forceUpdate();
        })
        .catch(error => {
          console.log('error');
        })
    }

    updateWindow() {
        this.forceUpdate();
        window.location.replace({state.path});
    }

    render() {
        return (
            <div>
                <button className="btn" onClick={this.loadPath}>Create gif</button>

                <a href={this.state.path} onChange={this.updateWindow}>asd</a>
            </div>
        );
    }
}

export default Controls;
