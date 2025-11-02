import React from "react";

// Terima props sorting: onSort, sortColumn, sortDirection
const SearchResults = ({ results, onSort, sortColumn, sortDirection, onAddToPlaylist}) => {

  // Fungsi utilitas untuk menampilkan indikator panah (asc/desc)
  const renderSortIndicator = (columnName) => {
    if (sortColumn === columnName) {
      return sortDirection === 'asc' ? ' ▲' : ' ▼';
    }
    return null;
  };
  
  // Komponen Header Tabel yang Dapat Diklik
  const SortableHeader = ({ children, columnKey }) => (
    <th 
      className={`table-${columnKey.toLowerCase()} sortable-header`}
      onClick={() => onSort(columnKey)} 
      style={{ cursor: 'pointer' }}
    >
      {children}
      {renderSortIndicator(columnKey)}
    </th>
  );
  

  return (
    <table className="Table-Hasil">
      <thead>
        <tr className="Table-head">
          <th className="table-artwork">Artwork</th> 
          <SortableHeader columnKey="trackName">Track Name</SortableHeader>
          <SortableHeader columnKey="artistName">Artist</SortableHeader>
          <SortableHeader columnKey="trackPrice">Price</SortableHeader>       {/* Kunci: trackPrice */}
          <th className="table-preview">Preview</th> 
          <th className="table-action">Action</th>
        </tr>
      </thead>
      <tbody>
        {results.length > 0 ? (
          results.map((item, index) => (
            <tr key={item.trackId || index}>
              <td className="p-4">
                <img 
                    src={item.artworkUrl60} 
                    alt={`Artwork for ${item.trackName}`} 
                    className="track-artwork-img"
                />
              </td>
              <td className="p-4">{item.trackName}</td> 
              <td className="p-4">{item.artistName}</td> 
              <td className="p-4">
                {item.trackPrice ? `${item.currency} ${item.trackPrice}` : 'N/A'}
              </td>
              <td className="p-4">
                {item.previewUrl ? ( 
                  <audio 
                    controls 
                    src={item.previewUrl} 
                    style={{ width: '210px', height: '40px' }}
                  >
                    Your browser does not support the audio element.
                  </audio>
                ) : (
                    <span>No Preview</span>
                )}
              </td>
              <td className="p-4">
                  <button 
                      onClick={() => onAddToPlaylist(item)} 
                      className="add-to-playlist-btn"
                  >
                      + Playlist
                  </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="6" className="tidakadahasil">No results found</td> {/* Colspan kembali menjadi 5 */}
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default SearchResults;