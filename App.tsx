import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { FilterButtons } from './components/FilterButtons';
import { MovieGrid } from './components/MovieGrid';
import { MovieModal } from './components/MovieModal';
import { Pagination } from './components/Pagination';
import { AdminDashboard } from './components/AdminDashboard';
import { Content } from './types';
import { supabase } from './lib/supabaseClient';

const MOVIES_PER_PAGE = 12;

type View = 'home' | 'admin';

// Re-formatted to a single line to prevent any potential parsing issues with newlines/whitespace.
const SELECT_QUERY = 'id, created_at, contentType:content_type, title, description, posterUrl:poster_url, releaseDate:release_date, quality, genres, downloadSections:download_sections';

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
    const fetchContent = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('content')
                .select(SELECT_QUERY)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching content:', error);
                alert('Could not fetch content. Make sure your Supabase credentials and table are set up correctly, including Row Level Security policies.');
            } else {
                setContent(data as Content[]);
            }
        } catch (error) {
            console.error('An unexpected error occurred:', error);
        } finally {
            setLoading(false);
        }
    };

    fetchContent();
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

  const handleAddContent = async (newContentData: Omit<Content, 'id' | 'created_at'>) => {
    try {
        // Convert camelCase to snake_case for Supabase insert
        const { contentType, posterUrl, releaseDate, downloadSections, ...rest } = newContentData;
        const insertData = {
            ...rest,
            content_type: contentType,
            poster_url: posterUrl,
            release_date: releaseDate,
            download_sections: downloadSections,
        };
        const { data, error } = await supabase
            .from('content')
            .insert([insertData])
            .select(SELECT_QUERY);

        if (error) {
            console.error('Error adding content:', error);
            alert('Failed to add content. Check console for details.');
            return;
        }

        if (data) {
            setContent(prevContent => [data[0] as Content, ...prevContent]);
        }
    } catch (error) {
        console.error('An unexpected error occurred:', error);
        alert('An unexpected error occurred while adding content.');
    }
  };

  const handleUpdateContent = async (updatedContent: Content) => {
    try {
        // Convert camelCase to snake_case for Supabase update
        const { id, created_at, contentType, posterUrl, releaseDate, downloadSections, ...rest } = updatedContent;
        const updateData = {
            ...rest,
            content_type: contentType,
            poster_url: posterUrl,
            release_date: releaseDate,
            download_sections: downloadSections,
        };
        const { data, error } = await supabase
            .from('content')
            .update(updateData)
            .eq('id', id)
            .select(SELECT_QUERY);

        if (error) {
            console.error('Error updating content:', error);
            alert('Failed to update content. Check console for details.');
            return;
        }

        if (data) {
            setContent(content.map(m => (m.id === updatedContent.id ? data[0] as Content : m)));
        }
    } catch (error) {
        console.error('An unexpected error occurred:', error);
        alert('An unexpected error occurred while updating content.');
    }
  };

  const handleDeleteContent = async (contentId: number) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
        try {
            const { error } = await supabase
                .from('content')
                .delete()
                .eq('id', contentId);

            if (error) {
                console.error('Error deleting content:', error);
                alert('Failed to delete content. Check console for details.');
                return;
            }

            setContent(content.filter(m => m.id !== contentId));
        } catch (error) {
            console.error('An unexpected error occurred:', error);
            alert('An unexpected error occurred while deleting content.');
        }
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
                    <div className="text-center text-xl text-gray-400 mt-16">Loading content from the database...</div>
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