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
            filter: 'filterNormal',
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
        [e.target.name]: !options
      });
      lastOptionsVisible = e.target.name;
    }

    render() {
        return (
            <div className="controls">
              <div className="control-bar">
                <button name="fpsOptionsVisible" onClick={(e, options) => this.handleClick(e, this.state.fpsOptionsVisible)}>FPS</button>
                <button name="durationOptionsVisible" onClick={(e, options) => this.handleClick(e, this.state.durationOptionsVisible)}>Duration</button>
                <button name="modeOptionsVisible" onClick={(e, options) => this.handleClick(e, this.state.modeOptionsVisible)}>Mode</button>
                <button name="filterOptionsVisible" onClick={(e, options) => this.handleClick(e, this.state.filterOptionsVisible)}>Filter</button>
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
                    <label className={ this.state.fps === '20' ? 'selected ' : ''}>
                      <input type="radio" name="fps" value="20" checked={this.state.fps === '20'} onChange={this.handleChange}/>
                      20fps
                    </label>
                  </fieldset>
                }

                {this.state.durationOptionsVisible &&
                  <fieldset>
                    <label className={ this.state.duration === '1' ? 'selected ' : ''}>
                      <input type="radio" name="duration" value="1" checked={this.state.duration === '1'} onChange={this.handleChange}/>
                      1sek.
                    </label>
                    <label className={ this.state.duration === '2' ? 'selected ' : ''}>
                      <input type="radio" name="duration" value="2" checked={this.state.duration === '2'} onChange={this.handleChange}/>
                      2sek.
                    </label>
                    <label className={ this.state.duration === '5' ? 'selected ' : ''}>
                      <input type="radio" name="duration" value="5" checked={this.state.duration === '5'} onChange={this.handleChange}/>
                      5sek.
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
                    <label className={ this.state.filter === 'filterNormal' ? 'selected ' : ''}>
                      <input type="radio" name="filter" value="filterNormal" checked={this.state.filter === 'filterNormal'} onChange={this.handleChange}/>
                      No Filter
                    </label>
                    <label className={ this.state.filter === 'filterGrey' ? 'selected ' : ''}>
                      <input type="radio" name="filter" value="filterGrey" checked={this.state.filter === 'filterGrey'} onChange={this.handleChange}/>
                      Grey
                    </label>
                    <label className={ this.state.filter === 'filterBlue' ? 'selected ' : ''}>
                      <input type="radio" name="filter" value="filterBlue" checked={this.state.filter === 'filterBlue'} onChange={this.handleChange}/>
                      Blue
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
