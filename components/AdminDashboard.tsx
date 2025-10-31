import React, { useState, useEffect, useRef } from 'react';
import { Content } from '../types';
import { EditIcon, TrashIcon, PlusIcon, XIcon, LayoutDashboardIcon, ClapperboardIcon, TvIcon, ImportIcon, SearchIcon, FilmIcon, MenuIcon, SettingsIcon } from './icons';
import { AdminPage } from './AdminPage';


type AdminView = 'dashboard' | 'movies' | 'webseries' | 'import' | 'settings' | 'form';

interface AdminDashboardProps {
  content: Content[];
  onAddContent: (content: Omit<Content, 'id' | 'created_at'>) => void;
  onUpdateContent: (content: Content) => void;
  onDeleteContent: (contentId: number) => void;
  onExit: () => void;
}

interface SidebarProps {
  activeView: AdminView;
  setView: (view: AdminView) => void;
  onExit: () => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setView, onExit, isOpen, setIsOpen }) => {
    const navItemClasses = (view: AdminView) => `flex items-center space-x-3 w-full text-left px-4 py-3 rounded-md transition-colors ${activeView === view ? 'bg-yellow-500 text-black' : 'text-gray-300 hover:bg-gray-700/50'}`;
    
    return (
        <>
            {/* Overlay for mobile */}
            <div 
                className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsOpen(false)}
                aria-hidden="true"
            ></div>

            <aside className={`fixed inset-y-0 left-0 w-64 bg-[#1a1a1a] p-4 flex flex-col flex-shrink-0 border-r border-gray-700 z-50 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex items-center justify-between space-x-2 text-white font-bold text-xl mb-8 px-2">
                     <div className="flex items-center space-x-2">
                        <FilmIcon className="w-8 h-8 text-red-500"/>
                        <span>Admin Panel</span>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="md:hidden p-1 text-gray-400 hover:text-white" aria-label="Close menu">
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>
                <nav className="flex-grow">
                    <ul className="space-y-2">
                        <li><button className={navItemClasses('dashboard')} onClick={() => setView('dashboard')}><LayoutDashboardIcon className="w-5 h-5"/><span>Dashboard</span></button></li>
                        <li><button className={navItemClasses('movies')} onClick={() => setView('movies')}><ClapperboardIcon className="w-5 h-5"/><span>Movies</span></button></li>
                        <li><button className={navItemClasses('webseries')} onClick={() => setView('webseries')}><TvIcon className="w-5 h-5"/><span>Web Series</span></button></li>
                        <li><button className={navItemClasses('import')} onClick={() => setView('import')}><ImportIcon className="w-5 h-5"/><span>Import</span></button></li>
                        <li><button className={navItemClasses('settings')} onClick={() => setView('settings')}><SettingsIcon className="w-5 h-5"/><span>Settings</span></button></li>
                    </ul>
                </nav>
                <button onClick={onExit} className="flex items-center justify-center space-x-2 mt-4 bg-gray-600 text-white font-bold px-4 py-2 rounded-md hover:bg-gray-700 transition-colors">
                    <XIcon className="w-5 h-5" />
                    <span>Exit Admin</span>
                </button>
            </aside>
        </>
    );
};

const DashboardView: React.FC<{content: Content[]}> = ({ content }) => {
    const movieCount = content.filter(c => c.contentType === 'Movie').length;
    const webSeriesCount = content.filter(c => c.contentType === 'Web Series').length;
    
    return (
        <div>
            <h2 className="text-3xl font-bold text-white mb-6">Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-700">
                    <h3 className="text-gray-400 text-sm font-medium">Total Movies</h3>
                    <p className="text-3xl font-bold text-white mt-2">{movieCount}</p>
                </div>
                <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-700">
                    <h3 className="text-gray-400 text-sm font-medium">Total Web Series</h3>
                    <p className="text-3xl font-bold text-white mt-2">{webSeriesCount}</p>
                </div>
                 <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-700">
                    <h3 className="text-gray-400 text-sm font-medium">Total Content</h3>
                    <p className="text-3xl font-bold text-white mt-2">{content.length}</p>
                </div>
            </div>
        </div>
    );
};

const ContentListView: React.FC<{
    content: Content[];
    contentType: 'Movie' | 'Web Series';
    onEdit: (content: Content) => void;
    onDelete: (id: number) => void;
    onAdd: () => void;
}> = ({ content, contentType, onEdit, onDelete, onAdd }) => {
    const filteredContent = content.filter(c => c.contentType === contentType);
    
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-white">{contentType}s</h2>
                <button onClick={onAdd} className="flex items-center space-x-2 bg-yellow-500 text-black font-bold px-4 py-2 rounded-md hover:bg-yellow-600 transition-colors">
                    <PlusIcon className="w-5 h-5" />
                    <span>Add New {contentType}</span>
                </button>
            </div>
             <div className="overflow-x-auto bg-[#1a1a1a] rounded-lg border border-gray-700">
                <table className="w-full text-left text-sm text-gray-300">
                    <thead className="bg-[#121212] text-xs text-gray-400 uppercase">
                        <tr>
                            <th scope="col" className="px-6 py-3">Poster</th>
                            <th scope="col" className="px-6 py-3">Title</th>
                            <th scope="col" className="px-6 py-3">Release Date</th>
                            <th scope="col" className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredContent.map(item => (
                            <tr key={item.id} className="border-b border-gray-700 hover:bg-[#2a2a2a]/50">
                                <td className="px-6 py-4"><img src={item.posterUrl} alt={item.title} className="w-12 h-16 object-cover rounded-md" /></td>
                                <td className="px-6 py-4 font-medium text-white">{item.title}</td>
                                <td className="px-6 py-4">{item.releaseDate}</td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end items-center space-x-3">
                                        <button onClick={() => onEdit(item)} className="p-2 text-blue-400 hover:text-blue-300" aria-label="Edit item"><EditIcon className="w-5 h-5" /></button>
                                        <button onClick={() => onDelete(item.id)} className="p-2 text-red-400 hover:text-red-300" aria-label="Delete item"><TrashIcon className="w-5 h-5" /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const ImportView: React.FC<{ onAddContent: (content: Omit<Content, 'id' | 'created_at'>) => void; tmdbApiKey: string; }> = ({ onAddContent, tmdbApiKey }) => {
    const [query, setQuery] = useState('');
    const [searchType, setSearchType] = useState<'movie' | 'tv'>('movie');
    const [results, setResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const debounceTimeoutRef = useRef<number | null>(null);

    useEffect(() => {
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }

        if (query.trim() === '') {
            setResults([]);
            setError(null);
            setIsSearching(false);
            return;
        }

        if (!tmdbApiKey) {
            setError('TMDB API Key is not set. Please add it in the Settings page.');
            setIsSearching(false);
            setResults([]);
            return;
        }

        setIsSearching(true);
        debounceTimeoutRef.current = window.setTimeout(async () => {
            setError(null);
            try {
                const res = await fetch(`https://api.themoviedb.org/3/search/${searchType}?api_key=${tmdbApiKey}&query=${encodeURIComponent(query)}`);
                if (!res.ok) {
                    if (res.status === 401) {
                        throw new Error('Invalid TMDB API Key. Please check your key in Settings.');
                    }
                    throw new Error('Failed to fetch from TMDB.');
                }
                const data = await res.json();
                setResults(data.results);
            } catch (err: any) {
                setError(err.message);
                setResults([]);
            } finally {
                setIsSearching(false);
            }
        }, 500);

        return () => {
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }
        };
    }, [query, searchType, tmdbApiKey]);

    const handleImport = async (id: number) => {
        if (!tmdbApiKey) {
            alert('TMDB API Key is not set. Please add it in the Settings page.');
            return;
        }
        try {
            const res = await fetch(`https://api.themoviedb.org/3/${searchType}/${id}?api_key=${tmdbApiKey}&append_to_response=genres`);
            if (!res.ok) throw new Error('Failed to fetch details from TMDB.');
            const data = await res.json();
            
            const releaseDateRaw = data.release_date || data.first_air_date;
            let formattedDate = '';
            if (releaseDateRaw) {
                const date = new Date(releaseDateRaw);
                date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
                formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
            }

            const newContent: Omit<Content, 'id' | 'created_at'> = {
                contentType: searchType === 'movie' ? 'Movie' : 'Web Series',
                title: `Download ${data.title || data.name} (${new Date(releaseDateRaw || Date.now()).getFullYear()})`,
                description: data.overview,
                posterUrl: data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : 'https://via.placeholder.com/500x750',
                releaseDate: formattedDate,
                quality: 'WEB-DL',
                genres: data.genres.map((g: { name: string }) => g.name),
            };
            onAddContent(newContent);
            alert(`Successfully imported "${data.title || data.name}"!`);
            setQuery('');
            setResults([]);
            setError(null);
        } catch (err: any) {
            alert(`Import failed: ${err.message}`);
        }
    };

    return (
        <div>
            <h2 className="text-3xl font-bold text-white mb-6">Import from TMDB</h2>
            <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-700 relative">
                <div className="flex items-end space-x-4">
                    <div className="flex-grow">
                        <label htmlFor="search-query" className="block text-sm font-medium text-gray-400 mb-2">Search Title</label>
                        <div className="relative">
                            <input id="search-query" type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="Start typing to search for a movie or web series..." className="w-full bg-[#2a2a2a] border border-gray-600 text-white rounded-md px-4 py-3 pl-10 focus:outline-none focus:ring-2 focus:ring-yellow-500"/>
                             <span className="absolute left-3 top-1/2 -translate-y-1/2">
                                <SearchIcon className="w-5 h-5 text-gray-400"/>
                            </span>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="search-type" className="block text-sm font-medium text-gray-400 mb-2">Type</label>
                        <select id="search-type" value={searchType} onChange={e => setSearchType(e.target.value as any)} className="bg-[#2a2a2a] border border-gray-600 text-white rounded-md px-4 py-3 h-[50px] focus:outline-none focus:ring-2 focus:ring-yellow-500">
                            <option value="movie">Movie</option>
                            <option value="tv">Web Series</option>
                        </select>
                    </div>
                </div>

                {query.trim() && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-[#2a2a2a] border border-gray-600 rounded-lg shadow-lg z-10 max-h-96 overflow-y-auto">
                        {isSearching && <p className="p-4 text-gray-400 text-center">Searching...</p>}
                        {error && <p className="p-4 text-red-400 text-center">{error}</p>}
                        {!isSearching && results.length === 0 && query && !error && <p className="p-4 text-gray-400 text-center">No results found.</p>}
                        
                        <ul className="divide-y divide-gray-700">
                            {results.map(result => (
                                <li key={result.id}>
                                    <button 
                                        onClick={() => handleImport(result.id)}
                                        className="w-full text-left flex items-center p-3 hover:bg-gray-700/50 transition-colors"
                                    >
                                        <img src={result.poster_path ? `https://image.tmdb.org/t/p/w92${result.poster_path}` : 'https://via.placeholder.com/92x138'} alt="" className="w-12 h-auto object-cover rounded-md mr-4 flex-shrink-0"/>
                                        <div className="flex-grow">
                                            <p className="font-semibold text-white">{result.title || result.name}</p>
                                            <p className="text-sm text-gray-400">{new Date(result.release_date || result.first_air_date || '').getFullYear() || 'N/A'}</p>
                                        </div>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

const SettingsView: React.FC<{ apiKey: string; onSave: (key: string) => void }> = ({ apiKey, onSave }) => {
    const [keyInput, setKeyInput] = useState(apiKey);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        setKeyInput(apiKey);
    }, [apiKey]);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(keyInput);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    return (
        <div>
            <h2 className="text-3xl font-bold text-white mb-6">Settings</h2>
            <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-700">
                <form onSubmit={handleSave} className="max-w-xl">
                    <div className="space-y-2">
                        <label htmlFor="tmdb-api-key" className="block text-sm font-medium text-gray-400">TMDB API Key</label>
                        <input
                            id="tmdb-api-key"
                            type="password"
                            value={keyInput}
                            onChange={(e) => setKeyInput(e.target.value)}
                            placeholder="Enter your TMDB API Key"
                            className="w-full bg-[#2a2a2a] border border-gray-600 text-white rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        />
                        <p className="text-xs text-gray-500">
                            Get your free API key from <a href="https://www.themoviedb.org/settings/api" target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:underline">themoviedb.org</a>. Your key is stored in your browser's local storage.
                        </p>
                    </div>
                    <div className="mt-6 flex items-center justify-end">
                         <span className={`text-green-400 text-sm mr-4 transition-opacity duration-300 ${showSuccess ? 'opacity-100' : 'opacity-0'}`}>
                            Saved successfully!
                        </span>
                        <button type="submit" className="bg-yellow-500 text-black font-bold px-5 py-2.5 rounded-md hover:bg-yellow-600 transition-colors">
                            Save Key
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


export const AdminDashboard: React.FC<AdminDashboardProps> = ({ content, onAddContent, onUpdateContent, onDeleteContent, onExit }) => {
    const [adminView, setAdminView] = useState<AdminView>('dashboard');
    const [contentToEdit, setContentToEdit] = useState<Content | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [tmdbApiKey, setTmdbApiKey] = useState<string>('');

    useEffect(() => {
        const storedKey = localStorage.getItem('tmdbApiKey');
        if (storedKey) {
            setTmdbApiKey(storedKey);
        }
    }, []);

    const handleSaveApiKey = (key: string) => {
        localStorage.setItem('tmdbApiKey', key);
        setTmdbApiKey(key);
    };

    const handleSetView = (view: AdminView) => {
        setAdminView(view);
        setIsSidebarOpen(false); // Close sidebar on navigation
    };

    const handleAddClick = () => {
        setContentToEdit(null);
        handleSetView('form');
    };

    const handleEditClick = (contentItem: Content) => {
        setContentToEdit(contentItem);
        handleSetView('form');
    };

    const handleSave = (savedContent: Omit<Content, 'id' | 'created_at'> | Content) => {
        if ('id' in savedContent) {
            onUpdateContent(savedContent);
        } else {
            onAddContent(savedContent);
        }
        handleSetView(savedContent.contentType === 'Movie' ? 'movies' : 'webseries');
    };

    const handleCancel = () => {
        const targetView = contentToEdit?.contentType === 'Movie' ? 'movies' : contentToEdit?.contentType === 'Web Series' ? 'webseries' : 'dashboard';
        handleSetView(targetView);
        setContentToEdit(null);
    }
    
    const renderAdminContent = () => {
        switch (adminView) {
            case 'dashboard': return <DashboardView content={content} />;
            case 'movies': return <ContentListView content={content} contentType="Movie" onEdit={handleEditClick} onDelete={onDeleteContent} onAdd={handleAddClick} />;
            case 'webseries': return <ContentListView content={content} contentType="Web Series" onEdit={handleEditClick} onDelete={onDeleteContent} onAdd={handleAddClick} />;
            case 'import': return <ImportView onAddContent={onAddContent} tmdbApiKey={tmdbApiKey} />;
            case 'settings': return <SettingsView apiKey={tmdbApiKey} onSave={handleSaveApiKey} />;
            case 'form': return <AdminPage contentToEdit={contentToEdit} onSave={handleSave} onCancel={handleCancel} />;
            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-[#121212]">
            <Sidebar 
                activeView={adminView} 
                setView={handleSetView} 
                onExit={onExit}
                isOpen={isSidebarOpen}
                setIsOpen={setIsSidebarOpen} 
            />
            <main className="flex-grow p-6 sm:p-8 md:ml-64">
                 <header className="md:hidden flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-2 text-white font-bold text-xl">
                        <FilmIcon className="w-8 h-8 text-red-500"/>
                        <span>Admin</span>
                    </div>
                    <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-gray-300 hover:text-white" aria-label="Open menu">
                        <MenuIcon className="w-6 h-6" />
                    </button>
                </header>
                {renderAdminContent()}
            </main>
        </div>
    );
};