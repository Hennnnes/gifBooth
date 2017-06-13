import React, { Component } from 'react';
import './App.css';

import Header from './Components/Header/Header';
import Preview from './Components/Preview/Preview';
import Controls from './Components/Controls/Controls';
import Footer from './Components/Footer/Footer';

class App extends Component {
  constructor() {
      super();


  }
  render() {
    return (
      <div className="app">
        <Header />
        <Preview />
        <Controls />

      </div>
    );
  }
}

export default App;
