import React, { Component } from 'react';
import './App.css';

import Header from './Components/Header/Header';
import Preview from './Components/Preview/Preview';
import Controls from './Components/Controls/Controls';

const client = new window.Messaging.Client(`broker.mqttdashboard.com`, 8000, `myclientid_${parseInt(Math.random() * 100, 10)}`);

class App extends Component {
  constructor() {
      super();
      const api_key = 'dc6zaTOxFJmzC';

      this.state = ({
        fetch_url: `http://api.giphy.com/v1/gifs/random?api_key=${api_key}&tag=smile&waiting`,
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

              console.log('connected to mqtt broker');
              client.subscribe('testtopic/gifBoothTest', {qos: 2});
              console.log('subscribed to topic');

              client.onMessageArrived = function(message){
                if(message.payloadString.substring(0, 21) === 'data:image/gif;base64') {
                  this.setState({ img_url: message.payloadString })
                }
              }.bind(this);
          }.bind(this),

          //Gets Called if the connection could not be established
          onFailure: function (message) {
              console.log(`Connection failed: ${message.errorMessage}`);
          }
      }
      client.connect(options);
  }

  sendMessage(controlsFPS, controlsMode, controlsDuration) {
      const payload = `expose, ${controlsDuration}, ${controlsFPS}, ${controlsMode}`;
      const message = new window.Messaging.Message(payload);
      message.destinationName = 'testtopic/gifBoothTest';
      message.qos = 2;
      client.send(message);
      console.log('message send');
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
