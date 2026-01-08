"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X, ChevronDown } from "lucide-react";

interface Option {
    value: string;
    label: string;
    subLabel?: string;
}

interface SearchableSelectProps {
    label?: string;
    placeholder?: string;
    options: Option[];
    value: string;
    onChange: (value: string, option?: Option) => void;
    error?: string;
    disabled?: boolean;
}

export function SearchableSelect({
    label,
    placeholder = "Search...",
    options,
    value,
    onChange,
    error,
    disabled = false,
}: SearchableSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Get the selected option
    const selectedOption = options.find(opt => opt.value === value);

    // Filter options based on search
    const filteredOptions = options.filter(opt =>
        opt.label.toLowerCase().includes(search.toLowerCase()) ||
        opt.subLabel?.toLowerCase().includes(search.toLowerCase())
    );

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSearch("");
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (option: Option) => {
        onChange(option.value, option);
        setIsOpen(false);
        setSearch("");
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange("", undefined);
        setSearch("");
    };

    const handleInputClick = () => {
        if (!disabled) {
            setIsOpen(true);
            setTimeout(() => inputRef.current?.focus(), 0);
        }
    };

    return (
        <div className="w-full" ref={containerRef}>
            {label && (
                <label className="block text-sm font-medium text-foreground mb-1">
                    {label}
                </label>
            )}
            <div className="relative">
                {/* Display field */}
                <div
                    onClick={handleInputClick}
                    className={`
                        w-full px-3 py-2 border bg-background text-foreground
                        flex items-center justify-between cursor-pointer
                        transition-colors
                        ${disabled ? "opacity-50 cursor-not-allowed" : "hover:border-primary/50"}
                        ${error ? "border-destructive" : "border-border"}
                        ${isOpen ? "border-primary ring-1 ring-primary/20" : ""}
                    `}
                >
                    {isOpen ? (
                        <div className="flex items-center gap-2 flex-1">
                            <Search size={16} className="text-muted-foreground" />
                            <input
                                ref={inputRef}
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder={placeholder}
                                className="flex-1 bg-transparent outline-none text-sm"
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                    ) : (
                        <span className={`text-sm ${selectedOption ? "text-foreground" : "text-muted-foreground"}`}>
                            {selectedOption ? (
                                <span>
                                    {selectedOption.label}
                                    {selectedOption.subLabel && (
                                        <span className="text-muted-foreground ml-2">({selectedOption.subLabel})</span>
                                    )}
                                </span>
                            ) : placeholder}
                        </span>
                    )}

                    <div className="flex items-center gap-1">
                        {value && !disabled && (
                            <button
                                type="button"
                                onClick={handleClear}
                                className="p-1 hover:bg-muted rounded transition-colors"
                            >
                                <X size={14} className="text-muted-foreground" />
                            </button>
                        )}
                        <ChevronDown
                            size={16}
                            className={`text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
                        />
                    </div>
                </div>

                {/* Dropdown */}
                {isOpen && (
                    <div className="absolute z-50 w-full mt-1 bg-background border border-border shadow-lg max-h-60 overflow-auto">
                        {filteredOptions.length === 0 ? (
                            <div className="px-3 py-2 text-sm text-muted-foreground">
                                No results found
                            </div>
                        ) : (
                            filteredOptions.map((option) => (
                                <div
                                    key={option.value}
                                    onClick={() => handleSelect(option)}
                                    className={`
                                        px-3 py-2 cursor-pointer text-sm
                                        transition-colors hover:bg-muted
                                        ${option.value === value ? "bg-primary/10 text-primary" : ""}
                                    `}
                                >
                                    <div className="font-medium">{option.label}</div>
                                    {option.subLabel && (
                                        <div className="text-xs text-muted-foreground">{option.subLabel}</div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
            {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
        </div>
    );
}
