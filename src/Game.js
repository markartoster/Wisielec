import React, { Component } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

class Game extends Component {

  constructor(props) {
    super(props)

    this.toggle = this.toggle.bind(this);
    this.toggleVictory = this.toggleVictory.bind(this);
  }

  state = {
    letter: '',
    guessedLetters: [],
    lifes: 3,
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
      let movie = movieDummy;
      
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
    let tempArrayMovieAct = this.state.movieAct;
    let tempArrayGuessedLetters = this.state.guessedLetters;
    let tempCorrectGuesses = this.state.correctGuesses;
    tempArrayGuessedLetters.push(this.state.letter);

    this.state.movie.forEach((movieChar, arrayIndex) => {
      if(movieChar === this.state.letter){
        tempArrayMovieAct[arrayIndex] = this.state.letter;
        tempCorrectGuesses++;
        this.setState({movieAct: tempArrayMovieAct, correctGuesses: tempCorrectGuesses})
        isGuessedLetterCorrect = true;
      }
    })
    
    if (isGuessedLetterCorrect === false && this.state.letter !== '')
      this.setState({guessedLetters: tempArrayGuessedLetters, lifes: (this.state.lifes-1)});
    else if (isGuessedLetterCorrect === true && this.state.letter !== '')
      this.setState({guessedLetters: tempArrayGuessedLetters});
    
    if(this.state.lifes === 0 && inputFrom === "Enter"){
      this.toggle();
      document.getElementById('letter-input').removeEventListener('keydown', this.enterShortcut, false);
      document.getElementById("checkButton").disabled = true;
      document.getElementById("checkButton").setAttribute('class', 'button-inactive');
    }
    else if (this.state.lifes === 1 && inputFrom === "Button"){
      this.toggle();
      document.getElementById('letter-input').removeEventListener('keydown', this.enterShortcut, false);
      document.getElementById("checkButton").disabled = true;
      document.getElementById("checkButton").setAttribute('class', 'button-inactive');
    }

    if(tempCorrectGuesses === this.state.lettersAmount){
      this.toggleVictory();
      console.log("Victory!");
      
    }
    this.setState({letter: ''})
    document.getElementById("letter-input").value = '';
  }

  updateLetter = (letter) => {
    this.setState({letter: letter});
  }

  toggle = () => {
    this.setState({
      gameOverModal: !this.state.gameOverModal
    });
  }

  toggleVictory = () => {
    this.setState({
      victoryModal: !this.state.victoryModal
    });
  }

  render() {

    const gameOverModal = (<div>
                            <Modal isOpen={this.state.gameOverModal} toggle={this.toggle} className={this.props.className}>
                              <ModalHeader toggle={this.toggle}>Koniec gry</ModalHeader>
                              <ModalBody>
                                Wykorzystano wszystkie szanse!
                              </ModalBody>
                              <ModalFooter>
                                <Button color="primary" onClick={this.toggle}>Zagraj ponownie</Button>{' '}
                                <Button color="secondary" onClick={this.toggle}>Wyjście</Button>
                              </ModalFooter>
                            </Modal>
                          </div>)

    const victoryModal = (<div>
                            <Modal isOpen={this.state.victoryModal} toggle={this.toggleVictory} className={this.props.className}>
                              <ModalHeader toggle={this.toggleVictory}>Gratulacje</ModalHeader>
                              <ModalBody>
                                Poprawnie odgadnięto tytuł filmu!
                              </ModalBody>
                              <ModalFooter>
                                <Button color="primary" onClick={this.toggleVictory}>Zagraj ponownie</Button>{' '}
                                <Button color="secondary" onClick={this.toggleVictory}>Wyjście</Button>
                              </ModalFooter>
                            </Modal>
                          </div>)

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
          <input id="letter-input" onChange={(event) => {
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
        <div className="picked-letters">{guessedLetters.map(guessedLetter => (<div className="guessed-letter">{`${guessedLetter} `}</div>))}</div>
        {gameOverModal}
        {victoryModal}
      </div>
    );
  }
}

export default Game;
