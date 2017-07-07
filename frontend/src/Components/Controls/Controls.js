import React from 'react';
import './Controls.css';
// import InputRadio from '../InputRadio/InputRadio';

let lastOptionsVisible;

class Controls extends React.Component {
    constructor(props) {
        super();
        this.state = {
            path: '',
            fps: '5',
            duration: '2',
            mode: 'normal',
            filter: 'None',
            fpsOptionsVisible: false,
            durationOptionsVisible: false,
            modeOptionsVisible: false,
            filterOptionsVisible: false
        }
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event){
      const target = event.target;
      const value = target.value;
      const name = target.name;

      this.setState({ [name]: value });
    }

    handleClick(e, options){
      this.setState({
        [lastOptionsVisible]: false,
        [e.currentTarget.name]: !options
      });
      lastOptionsVisible = e.currentTarget.name;
      console.log(e.currentTarget.name);
    }

    render() {
        return (
            <div className="controls">
              <div className="control-bar">
                <button className={this.state.fpsOptionsVisible ? 'active' : ''} name="fpsOptionsVisible" onClick={(e, options) => this.handleClick(e, this.state.fpsOptionsVisible)}>
                  FPS
                  <br />
                  <b>{this.state.fps}</b>
                </button>
                <button className={this.state.durationOptionsVisible ? 'active' : ''} name="durationOptionsVisible" onClick={(e, options) => this.handleClick(e, this.state.durationOptionsVisible)}>
                  Duration
                  <br />
                  <b>{this.state.duration} sec</b>
                </button>
                <button className={this.state.modeOptionsVisible ? 'active' : ''} name="modeOptionsVisible" onClick={(e, options) => this.handleClick(e, this.state.modeOptionsVisible)}>
                  Mode
                  <br />
                  <b>{this.state.mode}</b>
                </button>
                <button className={this.state.filterOptionsVisible ? 'active' : ''} name="filterOptionsVisible" onClick={(e, options) => this.handleClick(e, this.state.filterOptionsVisible)}>
                  Filter
                  <br />
                  <b>{this.state.filter}</b>
                </button>
              </div>
              <form>

                {/*<InputRadio name={'fps'} values={[5, 10, 20]} value={this.state.fps} handleChange={this.handleChange}/>  */}


                {this.state.fpsOptionsVisible &&
                  <fieldset>
                    <label className={ this.state.fps === '5' ? 'selected ' : ''}>
                      <input type="radio" name="fps" value="5" checked={this.state.fps === '5'} onChange={this.handleChange}/>
                      5fps
                    </label>
                    <label className={ this.state.fps === '10' ? 'selected ' : ''}>
                      <input type="radio" name="fps" value="10" checked={this.state.fps === '10'} onChange={this.handleChange}/>
                      10fps
                    </label>
                    {/* <label className={ this.state.fps === '20' ? 'selected ' : ''}>
                      <input type="radio" name="fps" value="20" checked={this.state.fps === '20'} onChange={this.handleChange}/>
                      20fps
                    </label> */}
                  </fieldset>
                }

                {this.state.durationOptionsVisible &&
                  <fieldset>
                    <label className={ this.state.duration === '1' ? 'selected ' : ''}>
                      <input type="radio" name="duration" value="1" checked={this.state.duration === '1'} onChange={this.handleChange}/>
                      1 sec
                    </label>
                    <label className={ this.state.duration === '2' ? 'selected ' : ''}>
                      <input type="radio" name="duration" value="2" checked={this.state.duration === '2'} onChange={this.handleChange}/>
                      2 sec
                    </label>
                    <label className={ this.state.duration === '3' ? 'selected ' : ''}>
                      <input type="radio" name="duration" value="3" checked={this.state.duration === '3x'} onChange={this.handleChange}/>
                      3 sec
                    </label>
                  </fieldset>
                }

                {this.state.modeOptionsVisible &&
                  <fieldset>
                    <label className={ this.state.mode === 'reverse' ? 'selected ' : ''}>
                      <input type="radio" name="mode" value="reverse" checked={this.state.mode === 'reverse'} onChange={this.handleChange}/>
                      Reverse
                    </label>
                    <label className={ this.state.mode === 'normal' ? 'selected ' : ''}>
                      <input type="radio" name="mode" value="normal" checked={this.state.mode === 'normal'} onChange={this.handleChange}/>
                      Normal
                    </label>
                    <label className={ this.state.mode === 'boomerang' ? 'selected ' : ''}>
                      <input type="radio" name="mode" value="boomerang" checked={this.state.mode === 'boomerang'} onChange={this.handleChange}/>
                      Boomerang
                    </label>
                  </fieldset>
                }

                {this.state.filterOptionsVisible &&
                  <fieldset>
                    <label className={ this.state.filter === 'None' ? 'selected ' : ''}>
                      <input type="radio" name="filter" value="None" checked={this.state.filter === 'None'} onChange={this.handleChange}/>
                      No Filter
                    </label>
                    <label className={ this.state.filter === 'Grey' ? 'selected ' : ''}>
                      <input type="radio" name="filter" value="Grey" checked={this.state.filter === 'Grey'} onChange={this.handleChange}/>
                      Grey
                    </label>
                    <label className={ this.state.filter === 'Orange' ? 'selected ' : ''}>
                      <input type="radio" name="filter" value="Orange" checked={this.state.filter === 'Orange'} onChange={this.handleChange}/>
                      Orange
                    </label>
                  </fieldset>
                }

              </form>
              <a className="btn__submit" onClick={(event, controlsFPS, controlsMode, controlsDuration, controlsFilter) => this.props.onSubmit(event, this.state.fps, this.state.mode, this.state.duration, this.state.filter)} />
            </div>
        );
    }
}

export default Controls;
