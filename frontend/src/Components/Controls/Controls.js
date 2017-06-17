import React from 'react';
import './Controls.css';


class Controls extends React.Component {
    constructor(props) {
        super();
        this.state = {
            path: '',
            fps: '',
            duration: '',
            mode: ''
        }
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event){
      const target = event.target;
      const value = target.value;
      const name = target.name;

      this.setState({ [name]: value });
    }

    render() {
        return (
            <div>              
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

              <button className="btn" onClick={(controlsFPS, controlsMode, controlsDuration) => this.props.onSubmit(this.state.fps, this.state.mode, this.state.duration)} />
              <br />

            </div>
        );
    }
}

export default Controls;
