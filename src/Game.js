import React, { Component } from 'react';
import './App.css';

class Game extends Component {

  state = {
    movie: [],
    movies: []
  }

  async componentDidMount() {
    try {
      const res = await fetch('https://api.themoviedb.org/3/discover/movie?api_key=a9a044fab959ff29628041fff2fcac7b&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1');
      const movies = await res.json();
      this.setState({
        movie: movies.results[Math.round(Math.random() * (19 - 0) + 0)].title.toUpperCase().split(''),
        movies: movies.results 
      });
      console.log(movies.results);
    } catch (e) {
      console.log(e);
    }
  }

  render() {

    const { movie } = this.state;
    let letterCell = []; 

    movie.map(letter => {
      if(letter !== ' ')
        letterCell.push((<div className="cell">{letter}</div>))
      else
        letterCell.push((<div className="empty-cell"></div>))
    })


    return (
      <div>
        {letterCell.map(letter => letter)}
      </div>
    );
  }
}

export default Game;
