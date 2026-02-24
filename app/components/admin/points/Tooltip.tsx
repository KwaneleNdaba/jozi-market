import React from 'react';
import { HelpCircle } from 'lucide-react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export const Tooltip: React.FC<TooltipProps> = ({ 
  content, 
  children, 
  position = 'top' 
}) => {
  const [isVisible, setIsVisible] = React.useState(false);

  return (
    <div className="relative inline-flex">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      {isVisible && (
        <div className={`
          absolute z-50 px-3 py-2 text-xs text-white bg-gray-900 rounded-lg shadow-lg whitespace-normal max-w-xs
          ${position === 'top' ? 'bottom-full left-1/2 -translate-x-1/2 mb-2' : ''}
          ${position === 'bottom' ? 'top-full left-1/2 -translate-x-1/2 mt-2' : ''}
          ${position === 'left' ? 'right-full top-1/2 -translate-y-1/2 mr-2' : ''}
          ${position === 'right' ? 'left-full top-1/2 -translate-y-1/2 ml-2' : ''}
        `}>
          {content}
          <div className={`
            absolute w-2 h-2 bg-gray-900 transform rotate-45
            ${position === 'top' ? 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2' : ''}
            ${position === 'bottom' ? 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2' : ''}
            ${position === 'left' ? 'right-0 top-1/2 -translate-y-1/2 translate-x-1/2' : ''}
            ${position === 'right' ? 'left-0 top-1/2 -translate-y-1/2 -translate-x-1/2' : ''}
          `} />
        </div>
      )}
    </div>
  );
};

export const HelpTooltip: React.FC<{ content: string }> = ({ content }) => {
  return (
    <Tooltip content={content}>
      <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
    </Tooltip>
  );
};
