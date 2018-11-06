import React, { Component } from 'react';
import './App.css';

class Game extends Component {

  state = {
    lifes: 10,
    movie: [],
    movies: []
  }

  async componentDidMount() {
    try {
      const res = await fetch('https://api.themoviedb.org/3/discover/movie?api_key=a9a044fab959ff29628041fff2fcac7b&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1');
      const movies = await res.json();
      this.setState({
        //movie: movies.results[Math.round(Math.random() * (19 - 0) + 0)].title.toUpperCase().split(''),
        movie: movies.results[7].title.toUpperCase().split(''),
        movies: movies.results 
      });
      console.log(movies.results);
    } catch (e) {
      console.log(e);
    }
  }

  render() {

    const { movie, lifes } = this.state;
    let letterCell = []; 

    movie.map(letter => {
      if(letter !== ' ' && letter !== ':' && letter !== '-')
        letterCell.push((<div className="cell">{letter}</div>))
      else if (letter === ':' || letter === '-')
        letterCell.push((<div className="empty-cell">{letter}</div>))
      else
        letterCell.push((<div className="empty-cell"></div>))
    })


    return (
      <div className="game">
        <div className="lifes">Lifes:</div>
        <div className="life-number">
          {lifes}
        </div>
        <div>
          {letterCell.map(letter => letter)}
        </div>
        <div className="input-container">
          <input className="input" type="text"></input>
        </div>
        <button>Click</button>
        <div className="picked-letters"></div>
      </div>
    );
  }
}

export default Game;
