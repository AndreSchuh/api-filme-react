import { useEffect, useState } from "react";
import { Container, Movie, MovieList, GenreFilterBar, GenreButton, SearchInput } from "./style";
import { Link } from "react-router-dom";

function Home() {
    const imagePath = "https://image.tmdb.org/t/p/w500";
    const [movies, setMovies] = useState([]);
    const [genres, setGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState(null);
    const [searchTerm, setSearchTerm] = useState(""); // 1. Novo estado

    const KEY = process.env.REACT_APP_KEY;

    useEffect(() => {
        fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${KEY}&language=pt-BR`)
            .then((response) => response.json())
            .then((data) => setMovies(data.results));
    }, [KEY]);

    useEffect(() => {
        fetch(`https://api.themoviedb.org/3/genre/movie/list?language=pt-BR&api_key=${KEY}`)
            .then(res => res.json())
            .then(data => setGenres(data.genres))
            .catch(err => console.error(err));
    }, [KEY]);

    // 3. Adapte o filtro para usar o termo de busca
    const filteredMovies = movies.filter(movie => {
        const matchesGenre = selectedGenre == null || movie.genre_ids.includes(selectedGenre);
        const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesGenre && matchesSearch;
    });

    return (
        <Container>
            <h1>Movies</h1>

            {/* 2. Input de Pesquisa */}
             <SearchInput
                type="text"
                placeholder="Pesquisar filme..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
            />
            {/* Genre Filter Bar */}
            <GenreFilterBar>
                <GenreButton
                    active={selectedGenre === null}
                    onClick={() => setSelectedGenre(null)}
                >
                    Todos
                </GenreButton>
                {genres.map((genre) => (
                    <GenreButton
                        key={genre.id}
                        active={selectedGenre === genre.id}
                        onClick={() => setSelectedGenre(genre.id)}
                    >
                        {genre.name}
                    </GenreButton>
                ))}
            </GenreFilterBar>
            
            {/* Lista de filmes */}
            <MovieList>
                {filteredMovies.map((movie) => {
                    return (
                        <Movie key={movie.id}>
                            <Link to={`/${movie.id}`}>
                                <img
                                    src={`${imagePath}${movie.poster_path}`}
                                    alt={movie.title}
                                    style={{ cursor: 'pointer' }}
                                />
                            </Link>
                            <span>{movie.title}</span>
                        </Movie>
                    );
                })}
            </MovieList>
        </Container>
    );
}

export default Home;