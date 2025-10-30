
import React from 'react';
import { Movie } from '../types';
import { StarIcon } from './icons';

interface MovieCardProps {
  movie: Movie;
  onCardClick: (movie: Movie) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, onCardClick }) => {
  const qualityBgColor = movie.quality === 'WEB-DL' ? 'bg-red-600' : 'bg-blue-600';

  return (
    <div 
      onClick={() => onCardClick(movie)}
      className="bg-[#1a1a1a] rounded-lg overflow-hidden group border border-gray-800/50 transition-all duration-300 hover:border-yellow-500 hover:shadow-2xl hover:shadow-yellow-500/10 cursor-pointer"
    >
      <div className="relative">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="w-full h-auto object-cover aspect-[2/3] transition-transform duration-300 group-hover:scale-105"
        />
        <div className={`absolute top-2 right-[-5px] text-white text-xs font-bold px-3 py-1 ${qualityBgColor} rounded-l-md shadow-lg`}>
          {movie.quality}
        </div>
        <div className="absolute bottom-[-15px] left-4">
            <div className="w-12 h-12 bg-yellow-400 text-black rounded-full flex items-center justify-center transform -rotate-12 shadow-lg">
                <StarIcon className="w-8 h-8"/>
            </div>
        </div>
      </div>
      <div className="p-4">
        <p className="text-xs text-gray-500 uppercase tracking-wider">{movie.releaseDate}</p>
        <h3 className="text-sm font-medium text-gray-200 mt-2 h-20 overflow-hidden group-hover:text-yellow-400 transition-colors duration-200">
          {movie.title}
        </h3>
      </div>
    </div>
  );
};