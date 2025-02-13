import { useState, useEffect } from 'react';
import './App.css';
import Search from './components/Search';
import Spinner from './components/Spinner';

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept:'application/json',
    Authorization:`Bearer ${API_KEY}`
  } 
}

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [ errorMessage, setErrorMessage ] = useState('');
  const [ movieList,setMovieList ] = useState([]);
  const [ isLoading, setIsLoading ] = useState(true);

  const fetchMovies = async () => {
    try {
      setIsLoading(true);
      setErrorMessage('');
      const endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint,API_OPTIONS);
      //alert(response);
      if(!response.ok)
        throw new Error('Failed to fetch moviessss');
      const data = await response.json();
      
      if(data.Response === 'false'){
        setErrorMessage(data.Error || 'Failed to fetch movies');
        setIsLoading([]);
        return;
      }
       
      setMovieList(data.results || []);
      console.log(data.results);

    } catch (error) {
      console.error(error);
      setErrorMessage(error);
    } finally {
      setIsLoading(true);
    }
  };

  useEffect(() => {
    fetchMovies();
  },[]);

  return (
    <main>
      <div className="pattern"/>
        <div className="wrapper">
          <header>
            <img src="./hero.png" alt="Hero Banner" />
            <h1>Find <span className="text-gradient">Movies</span> You'll Enjoy Without the Hassle!</h1>
            <Search searchTerm= { searchTerm } setSearchTerm = { setSearchTerm }/> 
          </header>
          <section className="all-movies">
            <h2>All Movies</h2>
            { isLoading ? (
              <Spinner/>  
            ) : errorMessage ? (
              <p className="text-red-500">{errorMessage}</p>
            ) : (
              <ul>
                { movieList.map((movie) => (
                  <p key={movie.id} className='text-white'>{movie.title}</p>
                ))}
              </ul>
            )
          }
           
          </section>
          
        </div>  
        
    </main>
  )
}

export default App
