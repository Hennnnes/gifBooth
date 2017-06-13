import React, { Component } from 'react';
import './App.css';

import Header from './Components/Header/Header';
import Preview from './Components/Preview/Preview';
import Controls from './Components/Controls/Controls';
import Footer from './Components/Footer/Footer';

const client = new window.Messaging.Client("broker.mqttdashboard.com", 8000, "myclientid_" + parseInt(Math.random() * 100, 10));

class App extends Component {
  constructor() {
      super();

      this.state = ({
        fetch_url: 'http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=smile&waiting',
        img_url: ''
      })

  }

  componentDidMount() {
      fetch(this.state.fetch_url, { method: 'GET' })
      .then(response => {
          if (!response.ok) {
              throw Error(response.error);
          }

          return response.json();
      })
      .then(result => {
          this.setState({ img_url: result.data.image_url });
      })

      const options = {
          timeout: 5,
          //Gets Called if the connection has sucessfully been established
          onSuccess: function () {
              console.log("Connected");

              client.subscribe('testtopic/gifBoothTest', {qos: 2});

              client.onMessageArrived = function(message){
                if(message.payloadString.substring(0, 21) == "data:image/gif;base64"){
                  this.setState({img_url: message.payloadString})
                }
              }.bind(this);

          }.bind(this),
          //Gets Called if the connection could not be established
          onFailure: function (message) {
              console.log("Connection failed: " + message.errorMessage);
          }
      }
      client.connect(options);
  }

  sendMessage(controlsFPS, controlsMode, controlsDuration) {
      var payload = "expose, " + controlsDuration + ", " + controlsFPS + ", " + controlsMode;
      var message = new window.Messaging.Message(payload);
      message.destinationName = 'testtopic/gifBoothTest';
      message.qos = 2;
      client.send(message);
  }

  render() {
    return (
      <div className="app">
        <Header />
        <Preview url={this.state.img_url} />
        <Controls url={this.state.img_url} onSubmit={(controlsFPS, controlsMode, controlsDuration) => this.sendMessage(controlsFPS, controlsMode, controlsDuration)}/>
      </div>
    );
  }
}

export default App;
