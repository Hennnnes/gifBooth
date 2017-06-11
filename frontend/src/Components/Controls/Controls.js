import React from 'react';
import './Controls.css';

const client = new window.Messaging.Client("broker.mqttdashboard.com", 8000, "myclientid_" + parseInt(Math.random() * 100, 10));

class Controls extends React.Component {
    constructor() {
        super();
        this.state = {
            path: '',
            framerate: '',
            fps: '',
            mode: ''
        }

        this.loadPath = this.loadPath.bind(this);
        this.forceUpdate = this.forceUpdate.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.handleChange = this.handleChange.bind(this);
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
          timeout: 5,
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

    sendMessage(topic, qos) {
        var payload = "expose, " + this.state.framerate + ", " + this.state.fps + ", " + this.state.mode;
        var message = new window.Messaging.Message(payload);
        message.destinationName = topic;
        message.qos = qos;
        client.send(message);
        console.log("button");
    }

    handleChange(event){
      const target = event.target;
      const value = target.value;
      const name = target.name;

      this.setState({
        [name]: value
      });
    }

    render() {
        return (
            <div>
              <h2>aks</h2>
              <form>
                Framrate:
                <input name="framerate" type="text" value={this.state.framerate} onChange={this.handleChange}/>
                <br />
                FPS:
                <input name="fps" type="text" value={this.state.fps} onChange={this.handleChange}/>
                <br />
                Mode:
                <input name="mode" type="text" value={this.state.mode} onChange={this.handleChange}/>
              </form>

              <button className="btn" onClick={() => this.sendMessage("testtopic/1", 2)}>Create gif</button>
              <br />
              <a href={this.state.path} onChange={this.updateWindow}>Update Window</a>
            </div>
        );
    }
}

export default Controls;
