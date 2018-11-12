import React, { Component } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

class Game extends Component {

  constructor(props) {
    super(props)

    this.toggleGameOverModal = this.toggleGameOverModal.bind(this);
    this.toggleVictoryModal = this.toggleVictoryModal.bind(this);
  }

  state = {
    letter: '',
    guessedLetters: [],
    lifes: 10,
    correctGuesses: 0,
    lettersAmount: 0,
    movie: [],
    movieAct: [],
    movies: [],
    gameOverModal: false,
    victoryModal: false
  }
  
  async componentDidMount() {
    try {
      const res = await fetch('https://api.themoviedb.org/3/discover/movie?api_key=a9a044fab959ff29628041fff2fcac7b&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1');
      const movies = await res.json();
      const randomIndex = Math.round(Math.random() * (19 - 0) + 0);
      let movieDummy = movies.results[randomIndex].title.toUpperCase().split('');
      let lettersAmount = 0;
      let moviesAct = movieDummy;
      
      for (let index = 0; index < moviesAct.length; index++) {
        if(moviesAct[index] !== ':' && moviesAct[index] !== '-' && moviesAct[index] !== ' '){
          lettersAmount++;
          moviesAct[index] = '';
        }    
      }
      this.setState({
        movie: movies.results[randomIndex].title.toUpperCase().split(''),
        movieAct: moviesAct,
        movies: movies.results,
        lettersAmount: lettersAmount
      });
    } catch (e) {
      console.log(e);
    }
    document.getElementById('letter-input').addEventListener('keydown', this.enterShortcut, false)
  }

  enterShortcut = (event) => {
    if(event.key === 'Enter')
        this.checkLetter("Enter");
  }

  checkLetter = (inputFrom) => {
    let isGuessedLetterCorrect = false;
    let isLetterPickedAlready = false;
    let tempArrayMovieAct = this.state.movieAct;
    let tempArrayGuessedLetters = this.state.guessedLetters; 
    let tempCorrectGuesses = this.state.correctGuesses;

    if(this.state.guessedLetters.length !== 0){
      this.state.guessedLetters.forEach(letter => {
        if(letter === this.state.letter){
          isLetterPickedAlready = true;
        }
      })
    }
  
    if(!isLetterPickedAlready){
      tempArrayGuessedLetters.push(this.state.letter)
      this.state.movie.forEach((movieChar, arrayIndex) => {
        if(movieChar === this.state.letter){
          tempArrayMovieAct[arrayIndex] = this.state.letter;
          tempCorrectGuesses++;
          this.setState({movieAct: tempArrayMovieAct, correctGuesses: tempCorrectGuesses})
          isGuessedLetterCorrect = true;
        }
      })
    }
    
    if (isGuessedLetterCorrect === false && this.state.letter !== '')
      this.setState({guessedLetters: tempArrayGuessedLetters, lifes: (this.state.lifes-1)});
    else if (isGuessedLetterCorrect === true && this.state.letter !== '')
      this.setState({guessedLetters: tempArrayGuessedLetters});
    
    if(this.state.lifes === 0 && inputFrom === "Enter"){
      this.toggleGameOverModal();
      document.getElementById('letter-input').removeEventListener('keydown', this.enterShortcut, false);
      document.getElementById("checkButton").disabled = true;
      document.getElementById("checkButton").setAttribute('class', 'button-inactive');
    }
    else if (this.state.lifes === 1 && inputFrom === "Button"){
      this.toggleGameOverModal();
      document.getElementById('letter-input').removeEventListener('keydown', this.enterShortcut, false);
      document.getElementById("checkButton").disabled = true;
      document.getElementById("checkButton").setAttribute('class', 'button-inactive');
    }

    if(tempCorrectGuesses === this.state.lettersAmount){
      this.toggleVictoryModal();
    }
    this.setState({letter: ''})
    document.getElementById("letter-input").value = '';
  }

  updateLetter = (letter) => {
    this.setState({letter: letter});
  }

  resetGameHelper = () => {
    const randomIndex = Math.round(Math.random() * (19 - 0) + 0);
    let lettersAmount = 0;
    let movie = this.state.movies[randomIndex].title.toUpperCase().split('');
    let moviesAct = movie

    for (let index = 0; index < moviesAct.length; index++) {
      if(moviesAct[index] !== ':' && moviesAct[index] !== '-' && moviesAct[index] !== ' '){
        lettersAmount++;
        moviesAct[index] = '';
      }    
    }

    this.setState({
      correctGuesses: 0,
      movieAct: moviesAct,
      movie: this.state.movies[randomIndex].title.toUpperCase().split(''),
      lettersAmount: lettersAmount,
      guessedLetters: [],
      lifes: 10
    });
  }

  toggleVictory = () => {
    this.resetGameHelper();
    this.setState({victoryModal: !this.state.victoryModal});
  }

  toggleGameOver = () => {
    this.resetGameHelper();
    document.getElementById('letter-input').addEventListener('keydown', this.enterShortcut, false);
    document.getElementById("checkButton").disabled = false;
    document.getElementById("checkButton").setAttribute('class', 'button-active');
    this.setState({gameOverModal: !this.state.gameOverModal})
  }

  toggleVictoryModal = () => {
    this.setState({victoryModal: !this.state.victoryModal})
  }
  toggleGameOverModal = () => {
    this.setState({gameOverModal: !this.state.gameOverModal});
  }

  render() {

    const gameOverModal = (<div>
                            <Modal isOpen={this.state.gameOverModal} className={this.props.className}>
                              <ModalHeader>Koniec gry</ModalHeader>
                              <ModalBody>
                                Wykorzystano wszystkie szanse!
                              </ModalBody>
                              <ModalFooter>
                                <Button color="primary" onClick={this.toggleGameOver}>Zagraj ponownie</Button>
                              </ModalFooter>
                            </Modal>
                          </div>)

    const victoryModal = (<div>
                            <Modal isOpen={this.state.victoryModal} className={this.props.className}>
                              <ModalHeader>Gratulacje</ModalHeader>
                              <ModalBody>
                                Poprawnie odgadnięto tytuł filmu!
                              </ModalBody>
                              <ModalFooter>
                                <Button color="primary" onClick={this.toggleVictory}>Zagraj ponownie</Button>
                              </ModalFooter>
                            </Modal>
                          </div>)

    const { lifes, movieAct, guessedLetters } = this.state;
    let letterCell = []; 

    movieAct.forEach((letter, index) => {
      if(letter !== ' ' && letter !== ':' && letter !== '-')
        letterCell.push((<div key={`${letter}${index}`} className="cell">{letter}</div>))
      else if (letter === ':' || letter === '-')
        letterCell.push((<div key={`${letter}${index}`} className="empty-cell">{letter}</div>))
      else
        letterCell.push((<div key={`${letter}${index}`} className="empty-cell"></div>))
    })


    return (
      <div className="game">
        <div className="title">Lifes:</div>
        <div className="life-number">
          {lifes}
        </div>
        <div className="movie-title">
          {letterCell.map(letter => letter)}
        </div>
        <div className="input-container">
          <input id="letter-input" placeholder="Wybierz literę" onChange={(event) => {
            let value = event.target.value.toUpperCase().split('')[0];
            if (value !== undefined)
              event.target.value = value;
            else
              event.target.value = '';
            this.updateLetter(value);
            }
          }
            className="input" type="text">
          </input>
        </div>
        <button id="checkButton" className="button-active" onClick={(event) => {
          this.checkLetter("Button")
        }}>Click</button>
        <div className="title">Wybrane litery:</div>
        <div className="picked-letters">{guessedLetters.map((guessedLetter, index) => (<div key={`${guessedLetter}${index}`} className="guessed-letter">{`${guessedLetter} `}</div>))}</div>
        {gameOverModal}
        {victoryModal}
      </div>
    );
  }
}

export default Game;
