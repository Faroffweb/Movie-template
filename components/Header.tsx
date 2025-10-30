
import React, { useState, useEffect, useRef } from 'react';
import { TvIcon, GlobeIcon, ChevronDownIcon, MenuIcon, XIcon, FilmIcon } from './icons';

const DropdownMenu: React.FC<{ items: string[], onSelect: (item: string | null) => void }> = ({ items, onSelect }) => (
    <div className="absolute top-full left-0 mt-2 w-48 bg-[#2a2a2a] border border-gray-700 rounded-md shadow-lg py-1 z-50 animate-fade-in-scale">
        <button onClick={() => onSelect(null)} className="w-full text-left block px-4 py-2 text-sm font-semibold text-yellow-400 hover:bg-gray-700/50">All</button>
        <div className="border-t border-gray-600 my-1"></div>
        <div className="max-h-60 overflow-y-auto">
            {items.map(item => (
                <button key={item} onClick={() => onSelect(item)} className="w-full text-left block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700/50">{item}</button>
            ))}
        </div>
    </div>
);


interface NavLinkWithDropdownProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  dropdownItems?: string[];
  onFilter: (filterType: string, value: string | null) => void;
  filterType: string;
}

const NavLinkWithDropdown: React.FC<NavLinkWithDropdownProps> = ({ children, icon, dropdownItems, onFilter, filterType }) => {
    const [isOpen, setIsOpen] = useState(false);
    const node = useRef<HTMLLIElement>(null);

    const handleClickOutside = (e: MouseEvent) => {
      if (node.current && !node.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSelect = (value: string | null) => {
        onFilter(filterType, value);
        setIsOpen(false);
    };

    return (
        <li ref={node} className="relative">
            <button onClick={() => setIsOpen(!isOpen)} className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-md transition-colors duration-200">
                {icon}
                <span>{children}</span>
                <ChevronDownIcon className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && dropdownItems && <DropdownMenu items={dropdownItems} onSelect={handleSelect} />}
        </li>
    );
};

export const Header: React.FC<{ 
  onFilterChange: (type: string, value: string | null) => void,
  genres: string[],
  years: string[],
  qualities: string[],
}> = ({ onFilterChange, genres, years, qualities }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const handleFilter = (type: string, value: string | null) => {
    onFilterChange(type, value);
    setIsMenuOpen(false); // Close mobile menu on selection
  };
  
  const MobileNavLink: React.FC<{ title: string, items: string[], filterType: string }> = ({title, items, filterType}) => (
    <>
      <h3 className="px-3 pt-4 pb-2 text-sm font-semibold text-gray-500 uppercase border-t border-gray-700">{title}</h3>
      <ul className="space-y-1">
        <li>
          <button onClick={() => handleFilter(filterType, null)} className="block w-full text-left px-5 py-2 rounded-md text-base font-medium text-yellow-400 hover:text-white hover:bg-gray-700/50">All</button>
        </li>
        {items.map(item => (
          <li key={item}>
            <button onClick={() => handleFilter(filterType, item)} className="block w-full text-left px-5 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700/50">{item}</button>
          </li>
        ))}
      </ul>
    </>
  );

  return (
    <header className="bg-[#1a1a1a] border-b-2 border-red-600 shadow-lg sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <a href="#" onClick={(e) => { e.preventDefault(); window.location.reload(); }} className="flex items-center space-x-2 text-white font-bold text-xl">
            <FilmIcon className="w-8 h-8 text-red-500"/>
            <span className="hidden sm:inline">MovieFlix</span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex">
            <ul className="flex items-center space-x-2">
                <li><a href="#" onClick={(e) => { e.preventDefault(); window.location.reload(); }} className="px-4 py-2 text-white font-bold hover:bg-gray-700/50 rounded-md transition-colors duration-200">HOME</a></li>
                <li><a href="#" className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-md transition-colors duration-200"><TvIcon className="w-5 h-5"/> <span>Featured</span></a></li>
                <NavLinkWithDropdown filterType="genre" dropdownItems={genres} onFilter={onFilterChange} icon={<GlobeIcon className="w-5 h-5"/>}>Genre</NavLinkWithDropdown>
                <NavLinkWithDropdown filterType="year" dropdownItems={years} onFilter={onFilterChange}>By Year</NavLinkWithDropdown>
                <NavLinkWithDropdown filterType="quality" dropdownItems={qualities} onFilter={onFilterChange}>By Qualities</NavLinkWithDropdown>
            </ul>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="text-gray-300 hover:text-white focus:outline-none p-2" 
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav className="md:hidden bg-[#1a1a1a] border-t border-gray-700 max-h-[calc(100vh-4.5rem)] overflow-y-auto">
          <ul className="px-2 pt-2 pb-4">
            <li><a href="#" onClick={(e) => { e.preventDefault(); window.location.reload(); }} className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700/50">HOME</a></li>
            <li><a href="#" className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700/50"><TvIcon className="w-5 h-5"/> <span>Featured</span></a></li>
            <MobileNavLink title="By Genre" items={genres} filterType="genre" />
            <MobileNavLink title="By Year" items={years} filterType="year" />
            <MobileNavLink title="By Quality" items={qualities} filterType="quality" />
          </ul>
        </nav>
      )}
    </header>
  );
};