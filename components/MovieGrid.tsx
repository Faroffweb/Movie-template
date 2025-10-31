import React from 'react';
import { Content } from '../types';
import { MovieCard } from './MovieCard';

interface MovieGridProps {
  movies: Content[];
  onMovieSelect: (movie: Content) => void;
}

export const MovieGrid: React.FC<MovieGridProps> = ({ movies, onMovieSelect }) => {
  if (movies.length === 0) {
    return <p className="text-center text-gray-400 text-lg">No content found. Try a different search.</p>;
  }
  
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
      {movies.map(movie => (
        <MovieCard key={movie.id} movie={movie} onCardClick={onMovieSelect} />
      ))}
    </div>
  );
};