import React, { Component } from 'react';
import './App.css';

class Game extends Component {

  state = {
    letter: '',
    guessedLetters: [],
    lifes: 10,
    movie: [],
    movieAct: [],
    movies: []
  }

  async componentDidMount() {
    try {
      const res = await fetch('https://api.themoviedb.org/3/discover/movie?api_key=a9a044fab959ff29628041fff2fcac7b&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1');
      const movies = await res.json();
      let moviesAct = movies.results[6].title.toUpperCase().split('');
      for (let index = 0; index < moviesAct.length; index++) {
        if(moviesAct[index] !== ':' && moviesAct[index] !== '-' && moviesAct[index] !== ' ')
          moviesAct[index] = '';
        
      }
      
      this.setState({
        //movie: movies.results[Math.round(Math.random() * (19 - 0) + 0)].title.toUpperCase().split(''),
        movie: movies.results[6].title.toUpperCase().split(''),
        movieAct: moviesAct,
        movies: movies.results 
      });
      console.log(movies.results);
    } catch (e) {
      console.log(e);
    }
  }

  checkLetter = (letter) => {
    let guessedLetterFlag = false;
    let tempArrayMovieAct = this.state.movieAct;
    let tempArrayGuessedLetters = this.state.guessedLetters;
    this.state.movie.forEach((movieChar, arrayIndex) => {

      if(movieChar === this.state.letter){
        tempArrayMovieAct[arrayIndex] = this.state.letter;
        if(guessedLetterFlag === false){
          tempArrayGuessedLetters.push(this.state.letter);
          guessedLetterFlag = true
        }
        this.setState({guessedLetters: tempArrayGuessedLetters, movieAct: tempArrayMovieAct})
      }

    })
    guessedLetterFlag = false
  }

  updateLetter = (letter) => {
    this.setState({letter: letter});
  }

  render() {

    const { movie, lifes, letter, movieAct, guessedLetters } = this.state;
    let letterCell = []; 

    movieAct.map(letter => {
      if(letter !== ' ' && letter !== ':' && letter !== '-')
        letterCell.push((<div className="cell">{letter}</div>))
      else if (letter === ':' || letter === '-')
        letterCell.push((<div className="empty-cell">{letter}</div>))
      else
        letterCell.push((<div className="empty-cell"></div>))
    })


    return (
      <div className="game">
        <div className="title">Lifes:</div>
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
        <div className="title">Letters Already Picked:</div>
        <div className="picked-letters">{guessedLetters.map(guessedLetter => (<div className="guessed-letter">{`${guessedLetter} `}</div>))}</div>
      </div>
    );
  }
}

export default Game;
