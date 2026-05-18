import React, { useState, useEffect, useCallback } from 'react';
import HomePage from './HomePage';
import DesktopHome from './DesktopHome';

// Breakpoint constants for maintainability
const MOBILE_BREAKPOINT = 768;

/**
 * ResponsiveHomepage component that automatically renders the appropriate
 * homepage layout based on screen size and device type.
 *
 * - Mobile (<= 768px): Renders HomePage component (mobile-optimized)
 * - Tablet/Desktop (> 768px): Renders DesktopHome component
 *
 * Features:
 * - Automatic detection on mount and window resize
 * - Debounced resize handling for performance
 * - Clean component lifecycle management
 */
const ResponsiveHomepage: React.FC = () => {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    // Initialize with current screen size to avoid flash of wrong layout
    if (typeof window !== 'undefined') {
      return window.innerWidth <= MOBILE_BREAKPOINT;
    }
    return false; // Default to desktop on server-side
  });

  const checkScreenSize = useCallback(() => {
    setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
  }, []);

  useEffect(() => {
    // Debounce resize handler to improve performance
    let resizeTimeout: ReturnType<typeof setTimeout>;

    const debouncedResizeHandler = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(checkScreenSize, 100);
    };

    // Add event listener for window resize
    window.addEventListener('resize', debouncedResizeHandler);

    // Cleanup function
    return () => {
      clearTimeout(resizeTimeout);
      window.removeEventListener('resize', debouncedResizeHandler);
    };
  }, [checkScreenSize]);

  // Render appropriate component based on screen size
  return isMobile ? <HomePage /> : <DesktopHome />;
};

export default ResponsiveHomepage;