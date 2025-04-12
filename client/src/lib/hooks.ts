import { useState, useEffect } from 'react';
import { LOCAL_STORAGE_KEYS } from './constants';

// Hook to manage itineraries in local storage
export function useLocalStorageItineraries() {
  const [itineraries, setItineraries] = useState<any[]>([]);
  
  // Load itineraries from localStorage
  useEffect(() => {
    const savedItineraries = localStorage.getItem(LOCAL_STORAGE_KEYS.ITINERARIES);
    if (savedItineraries) {
      try {
        setItineraries(JSON.parse(savedItineraries));
      } catch (error) {
        console.error('Failed to parse saved itineraries:', error);
        // Reset to empty array if parsing fails
        setItineraries([]);
      }
    }
  }, []);
  
  // Save itineraries to localStorage whenever they change
  const saveItinerary = (newItinerary: any) => {
    const updatedItineraries = [...itineraries, newItinerary];
    setItineraries(updatedItineraries);
    localStorage.setItem(LOCAL_STORAGE_KEYS.ITINERARIES, JSON.stringify(updatedItineraries));
    return updatedItineraries;
  };
  
  const deleteItinerary = (index: number) => {
    const updatedItineraries = itineraries.filter((_, i) => i !== index);
    setItineraries(updatedItineraries);
    localStorage.setItem(LOCAL_STORAGE_KEYS.ITINERARIES, JSON.stringify(updatedItineraries));
    return updatedItineraries;
  };
  
  const updateItinerary = (index: number, updatedItinerary: any) => {
    const updatedItineraries = [...itineraries];
    updatedItineraries[index] = updatedItinerary;
    setItineraries(updatedItineraries);
    localStorage.setItem(LOCAL_STORAGE_KEYS.ITINERARIES, JSON.stringify(updatedItineraries));
    return updatedItineraries;
  };
  
  return { itineraries, saveItinerary, deleteItinerary, updateItinerary };
}

// Hook to get current itinerary from local storage
export function useCurrentItinerary() {
  const [currentItinerary, setCurrentItinerary] = useState<any>(null);
  
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.CURRENT_ITINERARY);
    if (saved) {
      try {
        setCurrentItinerary(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to parse current itinerary:', error);
        setCurrentItinerary(null);
      }
    }
  }, []);
  
  const saveCurrentItinerary = (itinerary: any) => {
    setCurrentItinerary(itinerary);
    localStorage.setItem(LOCAL_STORAGE_KEYS.CURRENT_ITINERARY, JSON.stringify(itinerary));
  };
  
  const clearCurrentItinerary = () => {
    setCurrentItinerary(null);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.CURRENT_ITINERARY);
  };
  
  return { currentItinerary, saveCurrentItinerary, clearCurrentItinerary };
}

// Hook to get window size for responsive design
export function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });
  
  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Call handler right away so state gets updated with initial window size
    handleResize();
    
    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty array ensures that effect is only run on mount
  
  return windowSize;
}
