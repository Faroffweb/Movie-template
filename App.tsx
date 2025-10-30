import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { FilterButtons } from './components/FilterButtons';
import { MovieGrid } from './components/MovieGrid';
import { MovieModal } from './components/MovieModal';
import { Pagination } from './components/Pagination';
import { AdminPage } from './components/AdminPage';
import { Movie } from './types';
import { MOVIES } from './constants';

const MOVIES_PER_PAGE = 12;

const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<{ [key: string]: string | null }>({
    genre: null,
    year: null,
    quality: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [currentView, setCurrentView] = useState<'home' | 'admin'>('home');

  useEffect(() => {
    // Simulate fetching movies
    setTimeout(() => {
      setMovies(MOVIES);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let results = [...movies];

    // Search filter
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      results = results.filter(movie =>
        movie.title.toLowerCase().includes(lowercasedQuery)
      );
    }

    // Genre filter
    if (activeFilters.genre) {
      results = results.filter(movie => movie.genres.includes(activeFilters.genre!));
    }

    // Year filter
    if (activeFilters.year) {
      results = results.filter(movie => movie.releaseDate.includes(activeFilters.year!));
    }

    // Quality filter
    if (activeFilters.quality) {
      results = results.filter(movie => movie.quality === activeFilters.quality);
    }

    setFilteredMovies(results);
  }, [movies, searchQuery, activeFilters]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };
  
  const handleFilterChange = (type: string, value: string | null) => {
    setActiveFilters(prevFilters => ({
      ...prevFilters,
      [type]: value,
    }));
    setCurrentPage(1);
  };

  const handleMovieSelect = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  const handleAddMovie = (newMovieData: Omit<Movie, 'id'>) => {
    const newMovie = {
      ...newMovieData,
      id: movies.length > 0 ? Math.max(...movies.map(m => m.id)) + 1 : 1,
    };
    setMovies(prevMovies => [newMovie, ...prevMovies]);
    setCurrentView('home');
  };
  
  const allGenres = [...new Set(movies.flatMap(m => m.genres))].sort();
  const allYears = [...new Set(movies.map(m => new Date(m.releaseDate).getFullYear().toString()))].sort((a, b) => Number(b) - Number(a));
  const allQualities = ['WEB-DL', 'Blu-Ray'];

  // Pagination logic
  const totalPages = Math.ceil(filteredMovies.length / MOVIES_PER_PAGE);
  const startIndex = (currentPage - 1) * MOVIES_PER_PAGE;
  const currentMovies = filteredMovies.slice(startIndex, startIndex + MOVIES_PER_PAGE);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };


  return (
    <>
      <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      <div className="bg-[#121212] text-gray-300 min-h-screen">
        <Header 
          onFilterChange={handleFilterChange}
          genres={allGenres}
          years={allYears}
          qualities={allQualities}
        />
        <main className="container mx-auto px-4 py-8">
        {currentView === 'home' ? (
            <div className="grid grid-cols-1 lg:grid-cols-4 lg:gap-8">
              <aside className="lg:col-span-1 mb-8 lg:mb-0">
                <div className="bg-[#1a1a1a] p-4 rounded-lg shadow-lg border border-gray-700 sticky top-20">
                  <SearchBar onSearch={handleSearch} />
                  <FilterButtons />
                </div>
              </aside>

              <div className="lg:col-span-3">
                 {loading ? (
                  <div className="text-center text-xl">Loading movies...</div>
                ) : (
                  <>
                    <MovieGrid movies={currentMovies} onMovieSelect={handleMovieSelect} />
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPrev={handlePrevPage}
                      onNext={handleNextPage}
                    />
                  </>
                )}
              </div>
            </div>
        ) : (
          <AdminPage onAddMovie={handleAddMovie} onCancel={() => setCurrentView('home')} />
        )}
        </main>
        <footer className="text-center py-6 border-t border-gray-800 text-gray-500">
          <p>&copy; 2025 MovieFlix. All Rights Reserved.</p>
          <p className="text-sm mt-2">This is a concept UI created with React and Tailwind CSS.</p>
          <button onClick={() => setCurrentView('admin')} className="mt-4 text-sm text-yellow-500 hover:text-yellow-400">Admin Panel</button>
        </footer>
      </div>
    </>
  );
};

export default App;