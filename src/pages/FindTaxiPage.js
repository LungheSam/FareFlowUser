import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useAuth } from '../contexts/AuthContext';
import { collection, getDocs, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase';

// Fix for default marker icons in Leaflet
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const FindTaxiPage = () => {
  const navigate = useNavigate();
  const { userData } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [availableTaxis, setAvailableTaxis] = useState([]);
  const [filteredTaxis, setFilteredTaxis] = useState([]);
  const [loading, setLoading] = useState(true);
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);

  // Fetch available taxis from Firestore
  useEffect(() => {
    let unsubscribe;

    const fetchTaxis = async () => {
      try {
        const taxisCollection = collection(db, 'vehicles');
        const q = query(taxisCollection, where('active', '==', true));
        
        // Use onSnapshot for real-time updates
        unsubscribe = onSnapshot(q, (querySnapshot) => {
          const taxis = [];
          querySnapshot.forEach((doc) => {
            taxis.push({ id: doc.id, ...doc.data() });
          });
          setAvailableTaxis(taxis);
          setFilteredTaxis(taxis);
          setLoading(false);
        });
      } catch (error) {
        console.error("Error fetching taxis:", error);
        setLoading(false);
      }
    };

    fetchTaxis();

    return () => {
      if (unsubscribe) unsubscribe();
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Initialize map only when component is mounted and container is available
  useEffect(() => {
    if (loading || !mapContainerRef.current || mapRef.current) return;

    // Default to Kampala coordinates
    const defaultPosition = [0.3136, 32.5811];
    
    // Initialize map
    mapRef.current = L.map(mapContainerRef.current, {
      preferCanvas: true,
    }).setView(defaultPosition, 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapRef.current);

    // Try to get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          mapRef.current.setView([latitude, longitude], 15);
          
          // Add user marker
          L.marker([latitude, longitude], {
            icon: L.icon({
              iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
            })
          })
          .addTo(mapRef.current)
          .bindPopup('Your Location')
          .openPopup();
        },
        () => {
          // Use default position if geolocation fails
          mapRef.current.setView(defaultPosition, 13);
        }
      );
    }
  }, [loading]);

  // Update taxi markers on map
  useEffect(() => {
    if (!mapRef.current || loading || !filteredTaxis.length) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add new markers for each taxi
    filteredTaxis.forEach(taxi => {
      if (taxi.location?.latitude && taxi.location?.longitude) {
        const marker = L.marker([taxi.location.latitude, taxi.location.longitude], {
          icon: L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
          })
        })
        .addTo(mapRef.current)
        .bindPopup(`
          <b>${taxi.numberPlate || 'Taxi'}</b><br>
          Route: ${taxi.route || 'Unknown'}<br>
          Capacity: ${taxi.capacity || 'N/A'}<br>
          ${taxi.driver ? `Driver: ${taxi.driver}` : ''}
        `);

        markersRef.current.push(marker);
      }
    });

    // Fit map to show all markers if there are multiple
    if (filteredTaxis.length > 1) {
      const bounds = L.latLngBounds(
        filteredTaxis
          .filter(t => t.location)
          .map(t => [t.location.latitude, t.location.longitude])
      );
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [filteredTaxis, loading]);

  const filterBuses = () => {
    if (!searchQuery) {
      setFilteredTaxis(availableTaxis);
      return;
    }

    const filtered = availableTaxis.filter(taxi =>
      taxi.route?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredTaxis(filtered);
  };

  const handleBackClick = () => {
    navigate('/');
  };

  return (
    <div id="container" className="container">
      <Header onProfileClick={() => navigate('/profile')} />
      
      <main id="main-content">
        <div id="find-taxi-page" className="page">
          <div className="title">
            <button onClick={handleBackClick}>
              <i className='bx bxs-left-arrow-circle'></i>
            </button>
            <h2 style={{ marginLeft: '0.5rem' }}>Find a Taxi Bus</h2>
          </div>
          
          <div className="search-container">
            <i className='bx bx-search search-icon'></i>
            <input
              type="text"
              id="search-bar"
              placeholder="Filter by destination..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                filterBuses();
              }}
            />
          </div>
          
          {loading ? (
            <div className="loading-message">Loading taxi locations...</div>
          ) : filteredTaxis.length === 0 ? (
            <div className="no-results">
              {searchQuery ? 
                'No taxis found for this route' : 
                'No available taxis at this time'}
            </div>
          ) : (
            <div 
              id="map" 
              ref={mapContainerRef}
              style={{ 
                height: '500px', 
                width: '100%',
                zIndex: 0 // Ensure proper stacking context
              }}
            ></div>
          )}
          
          <div className="taxi-list">
            {filteredTaxis.slice(0, 5).map(taxi => (
              <div key={taxi.id} className="taxi-card">
                <div className="taxi-info">
                  <h4>{taxi.numberPlate}</h4>
                  <p>{taxi.route}</p>
                  <p>Capacity: {taxi.capacity || 'N/A'}</p>
                </div>
                {taxi.driver && (
                  <div className="driver-info">
                    <i className='bx bxs-user'></i>
                    <span>{taxi.driver}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default FindTaxiPage;