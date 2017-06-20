import React from 'react';
import './Controls.css';
// import InputRadio from '../InputRadio/InputRadio';


class Controls extends React.Component {
    constructor(props) {
        super();
        this.state = {
            path: '',
            fps: '5',
            duration: '2',
            mode: 'normal',
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

                  {/*<InputRadio name={'fps'} values={[5, 10, 20]} value={this.state.fps} handleChange={this.handleChange}/>  */}


                  <fieldset>
                      <label className={ this.state.fps === '5' ? 'selected ' : ''}>
                        <input type="radio" name="fps" value="5" checked={this.state.fps === '5'} onChange={this.handleChange}/>
                        5ps
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

                  <a className="btn" onClick={(event, controlsFPS, controlsMode, controlsDuration) => this.props.onSubmit(event, this.state.fps, this.state.mode, this.state.duration)} />

              </form>
            </div>
        );
    }
}

export default Controls;
