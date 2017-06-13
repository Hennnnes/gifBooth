import React from 'react';
import './Controls.css';


class Controls extends React.Component {
    constructor(props) {
        super();
        this.state = {
            path: '',
            framerate: '',
            fps: '',
            mode: '',
        }

        this.loadPath = this.loadPath.bind(this);
        this.forceUpdate = this.forceUpdate.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.slider = this.slider.bind(this);
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

    handleChange(event){
      const target = event.target;
      const value = target.value;
      const name = target.name;

      this.setState({
        [name]: value
      });
    }

    slider(){
      console.log("test");
    }

    send(){
      this.props.onClick(this.state.framerate);
    }

    render() {
        return (
            <div>
              <h2>aks</h2>

              <img id="image" src="http://www.reactiongifs.com/r/tcs.gif" />
              <a id="button" href="" download="test.gif">Download image</a>
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

              <ul onMouseDown={this.slider()}>
                <li>5p/s</li>
                <li>7p/s</li>
                <li>12p/s</li>
              </ul>

              <button className="btn" onClick={() => this.send()}></button>
              <br />
              {/* <a href={this.state.path} onChange={this.updateWindow}>Update Window</a> */}
            </div>
        );
    }
}

export default Controls;
