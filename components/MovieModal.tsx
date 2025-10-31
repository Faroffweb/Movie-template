
import React, { useState, useEffect } from 'react';
import { Content } from '../types';
import { XIcon } from './icons';
import { DownloadLinks } from './DownloadLinks';

interface MovieModalProps {
  movie: Content | null;
  onClose: () => void;
}

const DESCRIPTION_CHAR_LIMIT = 200;

export const MovieModal: React.FC<MovieModalProps> = ({ movie, onClose }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Reset the expanded state when a new movie is opened
    if (movie) {
      setIsExpanded(false);
    }
  }, [movie]);

  if (!movie) {
    return null;
  }

  // A helper to clean up the long titles for display
  const getCleanTitle = (title: string) => {
    return title.split('(')[0].replace(/Download/g, '').trim();
  };

  const qualityBgColor = movie.quality === 'WEB-DL' ? 'bg-red-600' : 'bg-blue-600';

  const isLongDescription = movie.description.length > DESCRIPTION_CHAR_LIMIT;

  const descriptionText = isLongDescription && !isExpanded
    ? `${movie.description.substring(0, DESCRIPTION_CHAR_LIMIT)}...`
    : movie.description;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 p-4"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-[#1a1a1a] rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative flex flex-col border border-gray-700 animate-fade-in-scale"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="sticky top-3 right-3 self-end mr-3 text-gray-400 hover:text-white z-20 p-1 bg-[#1a1a1a]/80 rounded-full"
          aria-label="Close movie details"
        >
          <XIcon className="w-6 h-6" />
        </button>
        
        <div className="flex flex-col md:flex-row">
          <div className="w-full h-64 sm:h-96 md:h-auto md:w-1/3 flex-shrink-0">
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="w-full h-full object-cover md:rounded-l-lg"
            />
          </div>
          <div className="p-4 sm:p-6 md:p-8 md:w-2/3 flex flex-col text-left">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3">
              {getCleanTitle(movie.title)}
            </h2>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4 text-gray-400 text-sm">
              <span>{movie.releaseDate}</span>
              <span
                className={`px-2 py-1 text-xs font-bold text-white rounded ${qualityBgColor}`}
              >
                {movie.quality}
              </span>
            </div>
            <div className="text-gray-300 flex-grow leading-relaxed">
              <p>{descriptionText}</p>
              {isLongDescription && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-yellow-400 hover:text-yellow-300 font-semibold mt-2 text-sm focus:outline-none"
                >
                  {isExpanded ? 'Read Less' : 'Read More'}
                </button>
              )}
            </div>
          </div>
        </div>
        
        <div className="p-4 sm:p-6 md:p-8">
          {movie.downloadSections && <DownloadLinks sections={movie.downloadSections} />}
        </div>
      </div>
    </div>
  );
};