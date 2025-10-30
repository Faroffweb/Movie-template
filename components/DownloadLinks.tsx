
import React from 'react';
import { DownloadSection, DownloadLink } from '../types';
import { DownloadIcon } from './icons';

const getButtonStyles = (provider: string) => {
    switch (provider) {
        case 'G-Direct':
            return 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 shadow-cyan-500/30';
        case 'V-Cloud':
            return 'bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 shadow-red-500/30';
        case 'Batch/Zip':
            return 'bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 shadow-blue-600/30';
        case 'GDTot':
             return 'bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 shadow-rose-500/30';
        default:
            return 'bg-gray-600 hover:bg-gray-700 shadow-gray-500/30';
    }
};

const DownloadButton: React.FC<{ link: DownloadLink }> = ({ link }) => (
    <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`flex items-center justify-center gap-2 text-white font-semibold px-4 py-2 rounded-md shadow-lg transition-transform transform hover:scale-105 ${getButtonStyles(link.provider)}`}
    >
        <DownloadIcon className="w-4 h-4" />
        <span>{link.type.replace(/\[.*\]/, '').trim()}</span>
    </a>
);


export const DownloadLinks: React.FC<{ sections: DownloadSection[] }> = ({ sections }) => {
    const formatTitle = (title: string) => {
        const parts = title.split(/(\{[^}]+\})/g);
        return parts.map((part, index) => {
            if (part.startsWith('{') && part.endsWith('}')) {
                return <span key={index} className="text-cyan-400">{part}</span>;
            }
            return part;
        });
    };
    
    return (
        <div className="mt-6 border-t border-gray-700 pt-6">
             <h3 className="text-xl sm:text-2xl font-bold text-yellow-400 mb-6 text-center">
                Screenshots: (Must See Before Downloading)
            </h3>
            <div className="space-y-6">
                {sections.map((section, index) => (
                    <div key={index} className="p-4 bg-[#121212] rounded-lg">
                        <h4 className="text-md font-semibold text-center text-white mb-4">
                           {formatTitle(section.title)}
                        </h4>
                        <div className="flex flex-wrap justify-center gap-3">
                            {section.links.map((link, linkIndex) => (
                                <DownloadButton key={linkIndex} link={link} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
