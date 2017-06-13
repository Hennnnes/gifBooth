import React, { Component } from 'react';
import './App.css';

import Header from './Components/Header/Header';
import Preview from './Components/Preview/Preview';
import Controls from './Components/Controls/Controls';
import Footer from './Components/Footer/Footer';

let image = " ";

const client = new window.Messaging.Client("broker.mqttdashboard.com", 8000, "myclientid_" + parseInt(Math.random() * 100, 10));

client.onMessageArrived = function (message) {
    if(message.payloadString.substring(0, 21) == "data:image/gif;base64"){
      image = message.payloadString;
      // document.getElementById('image').src = message.payloadString;
      // document.getElementById('button').href = message.payloadString;
    }
};

class App extends Component {
  constructor() {
      super();

      this.state = ({
        framerate: ''
      })
  }

  componentDidMount(){
    var options = {
        timeout: 5,
        //Gets Called if the connection has sucessfully been established
        onSuccess: function () {
            console.log("Connected");
            client.subscribe('testtopic/image', {qos: 2});
        },
        //Gets Called if the connection could not be established
        onFailure: function (message) {
            console.log("Connection failed: " + message.errorMessage);
        }
    }
    client.connect(options);
    document.getElementsByTagName("h2")[0].innerHTML = "hello";
  }

  sendMessage(value) {
      this.setState({
        framerate: value
      });
      console.log(this.state.frame);
      var payload = "test";
      // var payload = "expose, " + this.state.framerate + ", " + this.state.fps + ", " + this.state.mode;
      var message = new window.Messaging.Message(payload);
      message.destinationName = 'testtopic/bar';
      message.qos = 2;
      client.send(message);
      console.log("button");
  }

  render() {
    return (
      <div className="app">
        <Header />
        <Preview />
        <Controls onClick={() => this.sendMessage()}/>

      </div>
    );
  }
}

export default App;
