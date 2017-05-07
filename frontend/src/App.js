import React, { Component } from 'react';
import './App.css';

import Header from './Components/Header/Header';
import Preview from './Components/Preview/Preview';
import Controls from './Components/Controls/Controls';
import Footer from './Components/Footer/Footer';


class App extends Component {
  render() {
    return (
      <div className="app">
          <Header />
          <Preview />
          <Controls />
          <Footer />

          <div>
              <h2>Some sample links to test stuff</h2>

              <a href="http://localhost:8080/start">Turn on</a>
              <a href="http://localhost:8080/stop">Turn on</a>

              <a href="http://localhost:8080/stop">Create sample gif</a>
          </div>
      </div>
    );
  }
}

export default App;
