import React, { useState } from 'react';
import { Movie, DownloadSection, DownloadLink } from '../types';
import { PlusIcon, TrashIcon } from './icons';

interface AdminPageProps {
  onAddMovie: (movie: Omit<Movie, 'id'>) => void;
  onCancel: () => void;
}

const InputField: React.FC<{ label: string; id: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void; type?: string; required?: boolean; as?: 'textarea' | 'select'; children?: React.ReactNode; }> = 
({ label, id, as = 'input', ...props }) => {
  const commonClasses = "w-full bg-[#2a2a2a] border border-gray-600 text-white rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-shadow";
  // Fix: Use React.createElement for dynamic tag rendering to avoid TypeScript errors with JSX.
  const Component = as === 'textarea' ? 'textarea' : as === 'select' ? 'select' : 'input';
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-400 mb-2">{label}</label>
      {React.createElement(Component, { id, className: commonClasses, ...props })}
    </div>
  );
};

const SmallButton: React.FC<{ onClick: () => void; children: React.ReactNode; className?: string; ariaLabel: string; }> = ({ onClick, children, className = '', ariaLabel }) => (
  <button type="button" onClick={onClick} className={`flex items-center space-x-2 px-3 py-1 text-sm rounded-md transition-colors ${className}`} aria-label={ariaLabel}>
    {children}
  </button>
);


export const AdminPage: React.FC<AdminPageProps> = ({ onAddMovie, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [posterUrl, setPosterUrl] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [quality, setQuality] = useState<'WEB-DL' | 'Blu-Ray'>('WEB-DL');
  const [genres, setGenres] = useState('');
  const [downloadSections, setDownloadSections] = useState<DownloadSection[]>([]);
  
  const handleAddSection = () => {
    setDownloadSections([...downloadSections, { title: '', links: [] }]);
  };

  const handleRemoveSection = (sectionIndex: number) => {
    setDownloadSections(downloadSections.filter((_, i) => i !== sectionIndex));
  };
  
  const handleSectionChange = (sectionIndex: number, field: keyof DownloadSection, value: string) => {
    const newSections = [...downloadSections];
    (newSections[sectionIndex] as any)[field] = value;
    setDownloadSections(newSections);
  };
  
  const handleAddLink = (sectionIndex: number) => {
    const newSections = [...downloadSections];
    newSections[sectionIndex].links.push({ provider: 'G-Direct', url: '', type: 'G-Direct [Instant]', size: '' });
    setDownloadSections(newSections);
  };

  const handleRemoveLink = (sectionIndex: number, linkIndex: number) => {
    const newSections = [...downloadSections];
    newSections[sectionIndex].links = newSections[sectionIndex].links.filter((_, i) => i !== linkIndex);
    setDownloadSections(newSections);
  };
  
  const handleLinkChange = (sectionIndex: number, linkIndex: number, field: keyof DownloadLink, value: string) => {
    const newSections = [...downloadSections];
    (newSections[sectionIndex].links[linkIndex] as any)[field] = value;
    setDownloadSections(newSections);
  };
  

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newMovie: Omit<Movie, 'id'> = {
      title,
      description,
      posterUrl,
      releaseDate,
      quality,
      genres: genres.split(',').map(g => g.trim()).filter(g => g),
      downloadSections: downloadSections.length > 0 ? downloadSections : undefined,
    };
    onAddMovie(newMovie);
  };

  const downloadLinkTypes: DownloadLink['type'][] = ['G-Direct [Instant]', 'V-Cloud [Resumable]', 'Batch/Zip', 'GDTot [G-Drive]'];

  return (
    <div className="bg-[#1a1a1a] p-6 sm:p-8 rounded-lg shadow-lg border border-gray-700 max-w-4xl mx-auto animate-fade-in-scale">
      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">Add New Movie</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="Title" id="title" value={title} onChange={e => setTitle(e.target.value)} required />
            <InputField label="Poster URL" id="posterUrl" value={posterUrl} onChange={e => setPosterUrl(e.target.value)} required />
            <InputField label="Release Date" id="releaseDate" value={releaseDate} onChange={e => setReleaseDate(e.target.value)} required type="text" />
            <InputField as="select" label="Quality" id="quality" value={quality} onChange={e => setQuality(e.target.value as any)} required>
                <option value="WEB-DL">WEB-DL</option>
                <option value="Blu-Ray">Blu-Ray</option>
            </InputField>
        </div>
        <InputField label="Genres (comma-separated)" id="genres" value={genres} onChange={e => setGenres(e.target.value)} required />
        <InputField as="textarea" label="Description" id="description" value={description} onChange={e => setDescription(e.target.value)} required />

        <div className="border-t border-gray-700 pt-6">
          <h3 className="text-xl font-semibold text-white mb-4">Download Links</h3>
          <div className="space-y-4">
            {downloadSections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="bg-[#121212] p-4 rounded-lg border border-gray-600">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-medium text-gray-200">Section {sectionIndex + 1}</h4>
                  <SmallButton onClick={() => handleRemoveSection(sectionIndex)} className="bg-red-600/20 text-red-400 hover:bg-red-600/40" ariaLabel="Remove section">
                      <TrashIcon className="w-4 h-4" />
                  </SmallButton>
                </div>
                <InputField label="Section Title" id={`section-title-${sectionIndex}`} value={section.title} onChange={e => handleSectionChange(sectionIndex, 'title', e.target.value)} />
                <div className="mt-4 space-y-3">
                    {section.links.map((link, linkIndex) => (
                        <div key={linkIndex} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 p-2 border border-gray-700 rounded-md">
                            <InputField as="select" label="Provider" id={`link-provider-${sectionIndex}-${linkIndex}`} value={link.provider} onChange={e => {
                                const provider = e.target.value;
                                const typeMap: Record<string, DownloadLink['type']> = {
                                    'G-Direct': 'G-Direct [Instant]', 'V-Cloud': 'V-Cloud [Resumable]', 'Batch/Zip': 'Batch/Zip', 'GDTot': 'GDTot [G-Drive]'
                                };
                                handleLinkChange(sectionIndex, linkIndex, 'provider', provider);
                                handleLinkChange(sectionIndex, linkIndex, 'type', typeMap[provider] || 'G-Direct [Instant]');
                            }}>
                                <option>G-Direct</option><option>V-Cloud</option><option>Batch/Zip</option><option>GDTot</option>
                            </InputField>
                            <InputField label="URL" id={`link-url-${sectionIndex}-${linkIndex}`} value={link.url} onChange={e => handleLinkChange(sectionIndex, linkIndex, 'url', e.target.value)} />
                            <InputField as="select" label="Type" id={`link-type-${sectionIndex}-${linkIndex}`} value={link.type} onChange={e => handleLinkChange(sectionIndex, linkIndex, 'type', e.target.value as any)}>
                                {downloadLinkTypes.map(t => <option key={t} value={t}>{t}</option>)}
                            </InputField>
                            <div className="flex items-end">
                                <InputField label="Size" id={`link-size-${sectionIndex}-${linkIndex}`} value={link.size} onChange={e => handleLinkChange(sectionIndex, linkIndex, 'size', e.target.value)} />
                                <button type="button" onClick={() => handleRemoveLink(sectionIndex, linkIndex)} className="ml-2 mb-1 p-2 text-red-500 hover:text-red-400" aria-label="Remove link">
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <SmallButton onClick={() => handleAddLink(sectionIndex)} className="mt-4 bg-green-600/20 text-green-400 hover:bg-green-600/40" ariaLabel="Add download link">
                  <PlusIcon className="w-4 h-4" /><span>Add Link</span>
                </SmallButton>
              </div>
            ))}
          </div>
          <SmallButton onClick={handleAddSection} className="mt-4 bg-blue-600/20 text-blue-400 hover:bg-blue-600/40" ariaLabel="Add download section">
            <PlusIcon className="w-4 h-4" /><span>Add Download Section</span>
          </SmallButton>
        </div>

        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-700">
          <button type="button" onClick={onCancel} className="bg-gray-600 text-white font-bold px-6 py-3 rounded-md hover:bg-gray-700 transition-colors">
            Cancel
          </button>
          <button type="submit" className="bg-yellow-500 text-black font-bold px-6 py-3 rounded-md hover:bg-yellow-600 transition-colors">
            Add Movie
          </button>
        </div>
      </form>
    </div>
  );
};