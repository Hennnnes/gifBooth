import React from 'react';
import './Controls.css';

const client = new window.Messaging.Client("broker.mqttdashboard.com", 8000, "myclientid_" + parseInt(Math.random() * 100, 10));

class Controls extends React.Component {
    constructor() {
        super();

        this.loadPath = this.loadPath.bind(this);
        this.forceUpdate = this.forceUpdate.bind(this);
        this.sendMessage = this.sendMessage.bind(this);

        this.state = {
            path: '',
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
    }

    componentDidMount(){
      var options = {
          timeout: 3,
          //Gets Called if the connection has sucessfully been established
          onSuccess: function () {
              console.log("Connected");
          },
          //Gets Called if the connection could not be established
          onFailure: function (message) {
              console.log("Connection failed: " + message.errorMessage);
          }
      }
      client.connect(options);
    }

    sendMessage(payload, topic, qos) {
        var message = new window.Messaging.Message(payload);
        message.destinationName = topic;
        message.qos = qos;
        client.send(message);
        console.log("button");
    }

    render() {
        return (
            <div>

              <button className="btn" onClick={() => this.sendMessage("expose", "testtopic/1", 2)}>Create gif</button>

              <a href={this.state.path} onChange={this.updateWindow}>asd</a>
            </div>
        );
    }
}

export default Controls;
