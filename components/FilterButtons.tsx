import React from 'react';
import { TelegramIcon } from './icons';

interface FilterButtonProps {
    children: React.ReactNode;
    className: string;
    icon?: React.ReactNode;
}

const PrimaryButton: React.FC<FilterButtonProps> = ({ children, className, icon }) => (
    <button className={`w-full flex items-center justify-center space-x-3 text-white font-semibold px-4 py-3 rounded-lg shadow-md transition-transform transform hover:scale-105 ring-1 ring-inset ring-white/10 ${className}`}>
        {icon}
        <span>{children}</span>
    </button>
);

export const FilterButtons: React.FC = () => {
  return (
    <div className="mt-6 flex flex-col space-y-4">
        <div className="flex flex-col gap-4">
            <PrimaryButton className="bg-gradient-to-r from-blue-500 to-sky-500" icon={<TelegramIcon className="w-5 h-5"/>}>Join Telegram</PrimaryButton>
        </div>
    </div>
  );
};