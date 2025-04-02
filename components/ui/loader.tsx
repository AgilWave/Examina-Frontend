// components/Loader.tsx
import React from 'react';

const Loader = ({ variant = 'pulse' }: { variant?: 'pulse' | 'rotate' | 'bounce' | 'morph' }) => {
  const getAnimationClass = () => {
    switch (variant) {
      case 'rotate':
        return 'animate-rotate';
      case 'bounce':
        return 'animate-bounce';
      case 'morph':
        return 'animate-morph';
      default:
        return 'animate-pulse';
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
      <div className={`w-20 h-20 ${getAnimationClass()}`}>
        <svg width="78" height="78" viewBox="0 0 78 78" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path 
            fillRule="evenodd" 
            clipRule="evenodd" 
            d="M27.6426 1.919C20.5283 4.205 16.4592 6.747 11.2028 12.189C2.70527 20.987 -1.1748 33.368 0.892113 45.087C2.44852 53.906 4.96723 58 8.83636 58C10.4604 58 12.8826 57.5 14.2181 56.888L16.6473 55.776L14.0241 50.138C7.22124 35.516 13.5344 18.377 28.3034 11.378C45.8349 3.069 68.4943 16.819 67.4146 35.109L67.1141 40.195L64.3137 37.975C58.717 33.537 50.8186 36.577 38.5942 47.872C34.0344 52.085 33.4991 52.959 34.6345 54.334C38.216 58.67 53.5403 61.444 60.3322 58.986C63.038 58.007 63.0081 58.091 59.4674 61.439C52.0685 68.436 39.2848 69.681 28.0267 64.502C23.9088 62.607 22.2081 62.287 20.2407 63.039C16.0342 64.646 9.8743 64.152 6.27884 61.918C2.5142 59.58 2.09325 60.431 4.49653 65.522C6.22908 69.19 11.0366 72 15.5785 72C17.1717 72 20.3293 72.9 22.5962 74C41.1577 83.012 64.6013 74.983 73.6492 56.516C88.7595 25.673 59.9849 -8.475 27.6426 1.919ZM36.2646 22.665C31.6541 25.113 29.6737 27.153 27.6874 31.5C25.9728 35.251 25.107 43 26.4017 43C26.7231 43 29.2349 41.024 31.9815 38.61C41.3886 30.341 51.4117 26.88 58.6733 29.394L62.8588 30.843L60.0107 27.796C54.1374 21.51 42.9798 19.1 36.2646 22.665Z" 
            fill="currentColor" 
            className="text-black dark:text-white"
          />
        </svg>
      </div>
    </div>
  );
};

export default Loader;