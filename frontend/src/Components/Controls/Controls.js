import React from 'react';
import './Controls.css';


class Controls extends React.Component {
    constructor(props) {
        super();
        this.state = {
            path: '',
            fps: '',
            duration: '',
            mode: '',
        }

        this.loadPath = this.loadPath.bind(this);
        this.forceUpdate = this.forceUpdate.bind(this);
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

              <img id="image" src="http://www.reactiongifs.com/r/tcs.gif" />
              <a id="button" href="" download="test.gif">Download image</a>
              <form>
                FPS:
                <input name="fps" type="text" value={this.state.fps} onChange={this.handleChange}/>
                <br />
                Duration:
                <input name="duration" type="text" value={this.state.duration} onChange={this.handleChange}/>
                <br />
                Mode:
                <input name="mode" type="text" value={this.state.mode} onChange={this.handleChange}/>
              </form>

              <ul>
                <li>5p/s</li>
                <li>7p/s</li>
                <li>12p/s</li>
              </ul>

              <button className="btn" onClick={(controlsFPS, controlsMode, controlsDuration) => this.props.onSubmit(this.state.fps, this.state.mode, this.state.duration)}></button>
              <br />
              {/* <a href={this.state.path} onChange={this.updateWindow}>Update Window</a> */}
            </div>
        );
    }
}

export default Controls;
