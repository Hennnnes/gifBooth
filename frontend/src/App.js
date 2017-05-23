import React, { Component } from 'react';
import './App.css';

import Header from './Components/Header/Header';
import Controls from './Components/Controls/Controls';
import Footer from './Components/Footer/Footer';


class App extends Component {
  render() {
    return (
      <div className="app">
          <Header />
          <Controls />
      </div>
    );
  }
}

export default App;
