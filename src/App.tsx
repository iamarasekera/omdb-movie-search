import React,{ useState } from 'react';
import { Container} from '@mui/material';
import { Movie, MovieDetail, SearchResponse } from './types';
import SearchBar from './components/SearchBar';

const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [year, setYear] = useState<string>('');
  const [type, setType] = useState<'movie' | 'series' | 'episode' | ''>('');
 
  const onSearch = () => {
    // TODO : Implement Search Functionality
    console.log('Searching:', { query, year, type });
  };

  return (
    <Container>
       {/* SearchBar component */}
      <SearchBar 
        query={query} 
        setQuery={setQuery} 
        onSearch={onSearch}
        loading={loading}
        year={year}
        setYear={setYear}
        type={type}
        setType={setType}
      />
    </Container>
  );
};

export default App;
