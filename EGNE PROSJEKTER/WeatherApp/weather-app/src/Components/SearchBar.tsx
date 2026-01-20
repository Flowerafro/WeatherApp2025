import React, { useState, useEffect, useRef } from 'react';
import { FiSearch } from 'react-icons/fi';

interface SearchBarProps {
    onSearch: (city: string) => void;
    loading: boolean;
    small?: boolean;
    placeholder?: string;
}

interface GeocodingResult {
    id: number;
    name: string;
    country_code: string;
    country: string;
    admin1?: string;
}

export const SearchBar = ({ onSearch, loading, small = false, placeholder = "Enter city..." }: SearchBarProps) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState<GeocodingResult[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const dropdownRef = useRef<HTMLUListElement>(null);

    // Debounce logic
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (searchTerm.length < 2) {
                setSuggestions([]);
                return;
            }

            try {
                const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchTerm)}&count=5&language=en&format=json`;
                const response = await fetch(url);
                const data = await response.json();

                if (data.results) {
                    setSuggestions(data.results);
                    setShowSuggestions(true);
                } else {
                    setSuggestions([]);
                    setShowSuggestions(false);
                }
            } catch (error) {
                console.error("Error fetching suggestions:", error);
            }
        };

        const timerId = setTimeout(() => {
            fetchSuggestions();
        }, 300); // 300ms debounce

        return () => clearTimeout(timerId);
    }, [searchTerm]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setShowSuggestions(false);
        if (searchTerm.trim()) {
            onSearch(searchTerm);
        }
    };

    const handleSuggestionClick = (suggestion: GeocodingResult) => {
        const locationName = suggestion.name;
        setSearchTerm(locationName); // Or potentially format as `name, country` if desired
        setShowSuggestions(false);
        onSearch(locationName);
    };

    const formatSuggestion = (item: GeocodingResult) => {
        const parts = [item.name];
        if (item.admin1) parts.push(item.admin1);
        if (item.country) parts.push(item.country);
        return parts.join(', ');
    };

    return (
        <form className="search-form" onSubmit={handleSubmit} style={small ? { margin: 0 } : {}}>
            <div className="search-wrapper">
                <FiSearch className="search-icon" size={20} />
                <input
                    type="text"
                    className="search-input"
                    placeholder={placeholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
                    style={small ? { width: '200px', fontSize: '0.9rem', paddingLeft: '2.5rem' } : {}}
                />

                {showSuggestions && suggestions.length > 0 && (
                    <ul className="suggestions-dropdown" ref={dropdownRef}>
                        {suggestions.map((item) => (
                            <li
                                key={item.id}
                                className="suggestion-item"
                                onClick={() => handleSuggestionClick(item)}
                            >
                                {formatSuggestion(item)}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            {!small && (
                <button type="submit" className="search-button" disabled={loading}>
                    {loading ? '...' : 'Go'}
                </button>
            )}
        </form>
    );
};
