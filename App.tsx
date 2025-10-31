

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { FilterButtons } from './components/FilterButtons';
import { MovieGrid } from './components/MovieGrid';
import { MovieModal } from './components/MovieModal';
import { Pagination } from './components/Pagination';
import { AdminDashboard } from './components/AdminDashboard';
import { Content } from './types';
import { CONTENT } from './constants';

const MOVIES_PER_PAGE = 12;

type View = 'home' | 'admin';

const App: React.FC = () => {
  const [content, setContent] = useState<Content[]>([]);
  const [filteredContent, setFilteredContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<{ [key: string]: string | null }>({
    genre: null,
    year: null,
    quality: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [currentView, setCurrentView] = useState<View>('home');

  useEffect(() => {
    setLoading(true);
    // Simulate fetching data from a local constant
    setTimeout(() => {
        // Sort by created_at date to show newest first
        const sortedContent = [...CONTENT].sort((a, b) => {
            const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
            const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
            return dateB - dateA;
        });
        setContent(sortedContent);
        setLoading(false);
    }, 500); // Simulate a short loading time
  }, []);

  useEffect(() => {
    let results = [...content];

    // Search filter
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      results = results.filter(item =>
        item.title.toLowerCase().includes(lowercasedQuery)
      );
    }

    // Genre filter
    if (activeFilters.genre) {
      results = results.filter(item => item.genres.includes(activeFilters.genre!));
    }

    // Year filter
    if (activeFilters.year) {
      results = results.filter(item => item.releaseDate.includes(activeFilters.year!));
    }

    // Quality filter
    if (activeFilters.quality) {
      results = results.filter(item => item.quality === activeFilters.quality);
    }

    setFilteredContent(results);
    setCurrentPage(1);
  }, [content, searchQuery, activeFilters]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  
  const handleFilterChange = (type: string, value: string | null) => {
    setActiveFilters(prevFilters => ({
      ...prevFilters,
      [type]: value,
    }));
  };

  const handleContentSelect = (item: Content) => {
    setSelectedContent(item);
  };

  const handleCloseModal = () => {
    setSelectedContent(null);
  };

  const handleAddContent = (newContentData: Omit<Content, 'id' | 'created_at'>) => {
    const newContent: Content = {
        ...newContentData,
        id: Date.now(), // Use timestamp for a simple unique ID
        created_at: new Date().toISOString(),
    };
    setContent(prevContent => [newContent, ...prevContent]);
  };

  const handleUpdateContent = (updatedContent: Content) => {
     setContent(content.map(m => (m.id === updatedContent.id ? updatedContent : m)));
  };

  const handleDeleteContent = (contentId: number) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
        setContent(content.filter(m => m.id !== contentId));
    }
  };
  
  const allGenres = [...new Set(content.flatMap(m => m.genres))].sort();
  const allYears = [...new Set(content.map(m => new Date(m.releaseDate).getFullYear().toString()))].sort((a, b) => Number(b) - Number(a));
  const allQualities = ['WEB-DL', 'Blu-Ray'];

  // Pagination logic
  const totalPages = Math.ceil(filteredContent.length / MOVIES_PER_PAGE);
  const startIndex = (currentPage - 1) * MOVIES_PER_PAGE;
  const currentContent = filteredContent.slice(startIndex, startIndex + MOVIES_PER_PAGE);

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

  const renderView = () => {
    switch(currentView) {
      case 'admin':
        return <AdminDashboard 
                  content={content}
                  onAddContent={handleAddContent}
                  onUpdateContent={handleUpdateContent}
                  onDeleteContent={handleDeleteContent}
                  onExit={() => setCurrentView('home')}
                />;
      case 'home':
      default:
        return (
          <>
            <Header 
              onFilterChange={handleFilterChange}
              genres={allGenres}
              years={allYears}
              qualities={allQualities}
            />
            <main className="container mx-auto px-4 py-8">
              <div className="grid grid-cols-1 lg:grid-cols-4 lg:gap-8">
                <aside className="lg:col-span-1 mb-8 lg:mb-0">
                  <div className="bg-[#1a1a1a] p-4 rounded-lg shadow-lg border border-gray-700 sticky top-20">
                    <SearchBar onSearch={handleSearch} />
                    <FilterButtons />
                  </div>
                </aside>

                <div className="lg:col-span-3">
                   {loading ? (
                    <div className="text-center text-xl text-gray-400 mt-16">Loading content...</div>
                  ) : (
                    <>
                      <MovieGrid movies={currentContent} onMovieSelect={handleContentSelect} />
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
            </main>
            <footer className="text-center py-6 border-t border-gray-800 text-gray-500">
              <p>&copy; 2025 MovieFlix. All Rights Reserved.</p>
              <p className="text-sm mt-2">This is a concept UI created with React and Tailwind CSS.</p>
              <button onClick={() => setCurrentView('admin')} className="mt-4 text-sm text-yellow-500 hover:text-yellow-400">Admin Panel</button>
            </footer>
          </>
        );
    }
  }


  return (
    <div className="bg-[#121212] text-gray-300 min-h-screen">
      <MovieModal movie={selectedContent} onClose={handleCloseModal} />
      {renderView()}
    </div>
  );
};

export default App;
