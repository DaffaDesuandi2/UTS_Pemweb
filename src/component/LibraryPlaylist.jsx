// File: LibraryPlaylist.jsx

import React, { useState } from 'react';

// =========================================================
// PlaylistItem - Menerima onDelete dan Tombol Hapus
// =========================================================
function PlaylistItem({ playlist, onDelete }) { 
    // Log ini hanya untuk debug, bisa dihapus
    console.log(`PlaylistItem RENDER: ${playlist.name} - ${playlist.tracks.length} Songs`); 

    const handleRemove = (e) => {
        // Mencegah klik elemen induk (jika ada)
        e.stopPropagation(); 
        
        // Memastikan onDelete adalah fungsi sebelum dipanggil
        if (typeof onDelete === 'function' && 
            window.confirm(`Yakin ingin menghapus playlist "${playlist.name}"?`)) {
            
            onDelete(playlist.id); 
        }
    };
    
    return (
        <div className="playlist-item">
            <img 
                src={playlist.image || 'https://via.placeholder.com/60?text=No+Cover'} 
                alt={playlist.name} 
                className="playlist-cover"
            />
            <div className="playlist-info">
                <p className="playlist-name">{playlist.name}</p>
                <p className="song-count">{playlist.tracks.length} Songs</p>
            </div>
            {/* 🛑 Tombol Hapus */}
            <button 
                className="delete-playlist-btn"
                onClick={handleRemove}
            >
                &times; 
            </button>
        </div>
    );
};

// =========================================================
// Komponen PlaylistLibrary utama
// =========================================================
// 🛑 HARUS MENERIMA 'onDeletePlaylist' DI SINI
const PlaylistLibrary = ({ playlists, onCreatePlaylist, onDeletePlaylist }) => { 
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newPlaylistName, setNewPlaylistName] = useState('');
    const [newPlaylistImage, setNewPlaylistImage] = useState(null); 

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewPlaylistImage(reader.result); 
            };
            reader.readAsDataURL(file);
        } else {
            setNewPlaylistImage(null);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newPlaylistName.trim()) {
            const newPlaylist = {
                id: crypto.randomUUID(),
                name: newPlaylistName.trim(),
                image: newPlaylistImage, 
                tracks: [] 
            };
            onCreatePlaylist(newPlaylist);
            setNewPlaylistName('');
            setNewPlaylistImage(null);
            setShowCreateForm(false);
        }
    };

    const renderCreateForm = () => (
        <div className="create-playlist-form">
            <h3 className="form-title">Create New Playlist</h3>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Playlist Name"
                    value={newPlaylistName}
                    onChange={(e) => setNewPlaylistName(e.target.value)}
                    required
                    className="playlist-input"
                />
                <p className="upload-label">Upload Cover Image:</p>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                />
                {newPlaylistImage && (
                    <img src={newPlaylistImage} alt="Cover Preview" className="cover-preview"/>
                )}
                <div className="form-actions">
                    <button type="submit" disabled={!newPlaylistName.trim()} className="submit-btn">
                        Create
                    </button>
                    <button type="button" onClick={() => setShowCreateForm(false)} className="cancel-btn">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
    
    return (
        <div className="playlist-library">

            <button 
                className='Create-Playlist'
                onClick={() => setShowCreateForm(true)}
                disabled={showCreateForm}
            >
                <svg 
                    height="16" 
                    width="16" 
                    version="1.1" 
                    id="Capa_1" 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 309.059 309.059" 
                    style={{ fill: 'white' }} 
                    >
                    <g>
                        <g>
                            <path 
                                d="M280.71,126.181h-97.822V28.338C182.889,12.711,170.172,0,154.529,0S126.17,12.711,126.17,28.338
                                    v97.843H28.359C12.722,126.181,0,138.903,0,154.529c0,15.621,12.717,28.338,28.359,28.338h97.811v97.843
                                    c0,15.632,12.711,28.348,28.359,28.348c15.643,0,28.359-12.717,28.359-28.348v-97.843h97.822
                                    c15.632,0,28.348-12.717,28.348-28.338C309.059,138.903,296.342,126.181,280.71,126.181z"
                            />
                        </g>
                    </g>
                </svg>
                        <p> Create </p>
            </button>
            
            {showCreateForm && renderCreateForm()}

            <div className="playlists-list">
                {playlists.length > 0 ? (
                    playlists.map((playlist) => (
                    // 🛑 KUNCI: Meneruskan prop onDeletePlaylist ke PlaylistItem
                    <PlaylistItem 
                        key={playlist.id} 
                        playlist={playlist} 
                        onDelete={onDeletePlaylist}
                    />
                    ))
                ) : (
                    <p>No playlists yet.</p>
                )}
            </div>
        </div>
    );
};

export default PlaylistLibrary;