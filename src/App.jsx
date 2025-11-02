import React, { useState } from 'react'
import './App.css'
import Header from './component/Header';
import SearchResults from './component/datatable';
import PlaylistLibrary from './component/LibraryPlaylist';


// Fungsi helper untuk membandingkan nilai (sortData tetap sama)
const sortData = (data, column, direction) => {
// ... (isi fungsi sortData tetap sama)
    if (!column) return data; 

    const sortedData = [...data];

    sortedData.sort((a, b) => {
        let aValue = a[column];
        let bValue = b[column];

        if (column === 'trackPrice') {
            aValue = aValue || 0; 
            bValue = bValue || 0;
        } 
        
        else if (typeof aValue === 'string') {
            aValue = aValue.toLowerCase();
            bValue = bValue.toLowerCase();
        }

        if (aValue < bValue) {
            return direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
            return direction === 'asc' ? 1 : -1;
        }
        return 0;
    });

    return sortedData;
};


function App(){

    const [results, setResults] = useState([]);
    const [sortColumn, setSortColumn] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');

    const [playlists, setPlaylists] = useState([]);
    const [trackToAdd, setTrackToAdd] = useState(null);
    const [showAddToPlaylistModal, setShowAddToPlaylistModal] = useState(false); 


    const handleSort = (columnName) => {
        let newDirection = 'asc';
        
        if (sortColumn === columnName && sortDirection === 'asc') {
            newDirection = 'desc';
        } else if (sortColumn === columnName && sortDirection === 'desc') {
            newDirection = null; 
            setSortColumn(null);
            setSortDirection('asc');
            return;
        }

        setSortColumn(columnName);
        setSortDirection(newDirection);
    };
    const handleCreatePlaylist = (newPlaylist) => {
        setPlaylists(prev => [...prev, newPlaylist])
    };
    const handleTrackAddToPlaylist = (track) => {
        console.log("Tambah ke playlist:", track);
        setTrackToAdd(track);
        setShowAddToPlaylistModal(true); 
    };
    const handleDeletePlaylist = (playlistId) => {
        setPlaylists(prevPlaylists => {
            // Ini adalah logika filter yang benar
            return prevPlaylists.filter(p => p.id !== playlistId); 
        });
    };
    
   const addTrackToPlaylist = (playlistId) => {
       console.log(`0. KLIK: Memanggil addTrackToPlaylist untuk ID: ${playlistId}`);

       if (!trackToAdd) return;

       setPlaylists(prevPlaylists => {
                const updatedPlaylists = prevPlaylists.map(p => {
                    if (p.id === playlistId) {
                        const alreadyExist = p.tracks.some(t => t.trackId === trackToAdd.trackId);
                        
                        if (alreadyExist) {
                            console.log(`2. INFO: Lagu "${trackToAdd.trackName}" sudah ada di ${p.name}`);
                            return { ...p }; 
                        }
                        
                        const newTracks = [...p.tracks, trackToAdd];
                        console.log(`2. SUCCESS: Lagu "${trackToAdd.trackName}" ditambahkan ke ${p.name}. Jumlah lagu: ${newTracks.length}`);
                        
                        return { 
                            ...p, 
                            tracks: newTracks 
                        }; 
                    }
                    return { ...p }; 
                });

                
                setTimeout(() => {
                    const targetPlaylist = updatedPlaylists.find(p => p.id === playlistId);
                    if (targetPlaylist) {
                        console.log(`3. VERIFIKASI STATE: ${targetPlaylist.name} kini memiliki ${targetPlaylist.tracks.length} lagu.`);
                    }
                }, 0);


                return updatedPlaylists; 
        });


       
       setShowAddToPlaylistModal(false); 
       setTrackToAdd(null);
       
    };
    
        
    const sortedResults = sortData(results, sortColumn, sortDirection);
    


    return( 
        <div className="container">
            <Header setResults={setResults}/>
             <main>
                <aside>
                    <h1>Your library</h1>
                    <PlaylistLibrary 
                    playlists={playlists} 
                    onCreatePlaylist={handleCreatePlaylist}
                    onDeletePlaylist={handleDeletePlaylist}
                    />
                </aside>
                <div className="mainmenu">
                    
                    {results.length > 0 ? (
                        <SearchResults 
                            results={sortedResults} 
                            onSort={handleSort} 
                            sortColumn={sortColumn} 
                            sortDirection={sortDirection}
                            onAddToPlaylist={handleTrackAddToPlaylist}
                        />
                    ) : (
                        <>
                    <div className='mainmenu-text'>
                        <h1>Music Explorer</h1>
                        <p>Search your favorite songs and build
                        <br/> your playlist easily!.</p>
                    </div>
                    
                        </>
                    )}
                </div>
             </main>
             
            {showAddToPlaylistModal && trackToAdd && (
                <div className="modal-backdrop">
                    <div className="modal-content">
                        <h2 className="modal-title">Add "{trackToAdd.trackName}" to Playlist</h2>
                        <p className="modal-text">Select a playlist:</p>
                        {playlists.length === 0 ? (
                            <p className="no-playlists-modal">No playlists available. Please create one first.</p>
                        ) : (
                            <div className="playlist-options">
                                {playlists.map(playlist => (
                                    <button 
                                        key={playlist.id} 
                                        onClick={() => addTrackToPlaylist(playlist.id)}
                                        className="add-option-btn"
                                    >
                                        {playlist.name} ({playlist.tracks.length} songs)
                                    </button>
                                ))}
                            </div>
                        )}
                        <button 
                            onClick={() => {
                                setShowAddToPlaylistModal(false); 
                                setTrackToAdd(null);
                            }} 
                            className="close-modal-btn"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
           
    );
}

export default App