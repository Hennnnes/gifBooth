import React, { Component } from 'react';
import './App.css';

import Header from './Components/Header/Header';
import Preview from './Components/Preview/Preview';
import Controls from './Components/Controls/Controls';
import Footer from './Components/Footer/Footer';

class App extends Component {
  constructor() {
      super();

      this.state = {
          fetch_url: 'http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=waiting',
          img_url: ''
      }
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
  }


  render() {
    return (
      <div className="app">
        <Header />
        <Preview url={this.state.img_url} />
        <Controls />

      </div>
    );
  }
}

export default App;
