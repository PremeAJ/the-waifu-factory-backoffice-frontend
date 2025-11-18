import { useEffect } from "react";

interface UseDebounceSearchProps {
  searchInput: string;
  onSearch: (search: string) => void;
  delay?: number;
}

export const useDebounceSearch = ({ 
  searchInput, 
  onSearch, 
  delay = 1000 
}: UseDebounceSearchProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchInput);
    }, delay);

    return () => clearTimeout(timer);
  }, [searchInput, onSearch, delay]);
};