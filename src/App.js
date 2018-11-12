import React, { Component } from 'react';
import './App.css';
import Game from './Game';

class App extends Component {

  render() {
    return (
      <div className="App">
        <header className="App-header">Wisielec filmowy</header>
        <Game></Game>
        <div className="footer">
          <div className="footer-author">Aplikacja wykonana przez Karol Rosiński</div>
          <div className="footer-info">Aplikacja korzysta z API MovieDB</div>         
        </div>
      </div>
    );
  }
}

export default App;
