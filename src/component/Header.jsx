import React, { useState, useCallback, useRef } from "react"; 

function Header({ setResults }) { 
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false); 

  const inputRef = useRef(null); 
  const debounceTimer = useRef(null); 

  // Fungsi fetch API utama
  const fetchResults = async (term) => {
    if (!term.trim()) {
        setResults([]);
        return;
    }
    
    const ITUNES_API_URL = `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&media=music&entity=song&limit=25`;

    try {
        const response = await fetch(ITUNES_API_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        setResults(data.results);
        
    } catch (error) {
        console.error("Error fetching data from iTunes API:", error);
        setResults([]); 
    } finally {
        setIsLoading(false); 
        // Fokus dikembalikan, meskipun sekarang tidak lagi diperlukan karena input tidak dinonaktifkan
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }
  };


  // Fungsi Debounce: Menunda pemanggilan fetchResults
  const debounceSearch = useCallback((term) => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (!term.trim()) {
        setResults([]);
        setIsLoading(false);
        return;
    }

    debounceTimer.current = setTimeout(() => {
        setIsLoading(true); 
        fetchResults(term);
    }, 500); // Waktu tunda: 500ms
  }, []); 


  // ... (handleInputChange, handleSearchClick, handleKeyPress, handleHomeClick tetap sama) ...
  const handleInputChange = (e) => {
      const newTerm = e.target.value;
      setSearchTerm(newTerm);
      debounceSearch(newTerm); 
  };

  const handleSearchClick = () => {
      if (debounceTimer.current) {
          clearTimeout(debounceTimer.current);
      }
      setIsLoading(true); 
      fetchResults(searchTerm);
  };

  const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
          if (debounceTimer.current) {
              clearTimeout(debounceTimer.current);
          }
          setIsLoading(true); 
          fetchResults(searchTerm);
      }
  };

  const handleHomeClick = () => {
    setSearchTerm(''); 
    setResults([]);
    if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
    }
    setIsLoading(false);
  }


  return (
    <header className="header">
      {/* Tombol Beranda */}
      <button id="Berandabtn" className="Berandabutton" onClick={handleHomeClick}>
        {/* ... (SVG Icon) ... */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 256 256"
          width="24"
          height="24"
        >
          <g
            stroke="none"
            strokeWidth="1"
            strokeLinecap="butt"
            strokeLinejoin="miter"
            strokeMiterlimit="10"
            fontFamily="none"
            fontWeight="none"
            fontSize="none"
            textAnchor="none"
            style={{ mixBlendMode: "normal" }}
          >
            <g transform="scale(10.66667,10.66667)">
              <path d="M12,2c-0.26712,0.00003 -0.52312,0.10694 -0.71094,0.29688l-10.08594,8.80078c-0.12774,0.09426 -0.20313,0.24359 -0.20312,0.40234c0,0.27614 0.22386,0.5 0.5,0.5h2.5v8c0,0.552 0.448,1 1,1h4c0.552,0 1,-0.448 1,-1v-6h4v6c0,0.552 0.448,1 1,1h4c0.552,0 1,-0.448 1,-1v-8h2.5c0.27614,0 0.5,-0.22386 0.5,-0.5c0.00001,-0.15876 -0.07538,-0.30808 -0.20312,-0.40234l-10.08008,-8.79492c-0.00194,-0.00196 -0.0039,-0.00391 -0.00586,-0.00586c-0.18782,-0.18994 -0.44382,-0.29684 -0.71094,-0.29687z"></path>
            </g>
          </g>
        </svg>
      </button>

      {/* Kotak Pencarian */}
      <div className="Searchbox">
        <input
          type="text"
          id="Search"
          placeholder={isLoading ? "Searching..." : "What do you want to play?"}
          value={searchTerm}
          onChange={handleInputChange} 
          onKeyPress={handleKeyPress}
          // BARIS INI KITA HAPUS: disabled={isLoading} 
          ref={inputRef}
        />
        <button 
          id="searchbtn" 
          className="searchbutton"
          onClick={handleSearchClick}
          // Tombol Search tetap dinonaktifkan untuk mencegah klik ganda
          disabled={isLoading} 
        >
          {/* ... (SVG Icon) ... */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 50 50"
            width="20"
            height="20"
          >
            <path d="M21 3C11.654545 3 4 10.654545 4 20C4 29.345455 11.654545 37 21 37C24.701287 37 28.127393 35.786719 30.927734 33.755859L44.085938 46.914062L46.914062 44.085938L33.875 31.046875C36.43682 28.068316 38 24.210207 38 20C38 10.654545 30.345455 3 21 3zM21 5C29.254545 5 36 11.745455 36 20C36 28.254545 29.254545 35 21 35C12.745455 35 6 28.254545 6 20C6 11.745455 12.745455 5 21 5z"></path>
          </svg>
        </button>
      </div>
      {isLoading && <div className="loading-indicator">Loading results...</div>}
    </header>
  );
}

export default Header;