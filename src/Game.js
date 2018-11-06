import React, { Component } from 'react';
import './App.css';

class Game extends Component {

  state = {
    letter: '',
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
        movie: movies.results[13].title.toUpperCase().split(''),
        movies: movies.results 
      });
      console.log(movies.results);
    } catch (e) {
      console.log(e);
    }
  }

  checkLetter = (letter) => {

  }

  updateLetter = (letter) => {
    this.setState({letter: letter});
  }

  render() {

    const { movie, lifes, letter } = this.state;
    let letterCell = []; 

    movie.map(letter => {
      if(letter !== ' ' && letter !== ':' && letter !== '-')
        letterCell.push((<div className="cell">{}</div>))
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
          <input onChange={(event) => {
            let value = event.target.value.toUpperCase().split('')[0];
            if (value !== undefined)
              event.target.value = value;
            else
              event.target.value = '';
            this.updateLetter(value)}
          }
            className="input" type="text">
          </input>
        </div>
        <button onClick={(event) => {
          this.checkLetter()
        }}>Click</button>
        <div className="picked-letters"></div>
      </div>
    );
  }
}

export default Game;
