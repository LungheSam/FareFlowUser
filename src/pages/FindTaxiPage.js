import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useAuth } from '../contexts/AuthContext';
import { dbRT } from '../services/firebase';
import { ref, onValue } from 'firebase/database';

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
  const [allTaxis, setAllTaxis] = useState([]);
  const [filteredTaxis, setFilteredTaxis] = useState([]);
  const [loading, setLoading] = useState(true);
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    const busesRef = ref(dbRT, 'buses');
    const unsubscribe = onValue(busesRef, (snapshot) => {
      const data = snapshot.val();
      const taxis = [];

      if (data) {
        Object.entries(data).forEach(([id, bus]) => {
          if (bus.status && bus.location?.latitude && bus.location?.longitude) {
            taxis.push({
              id,
              ...bus,
              location: {
                latitude: bus.location.latitude,
                longitude: bus.location.longitude
              },
              departure: bus.route?.departure || '',
              destination: bus.route?.destination || '',
              vias: bus.route?.vias || [],
              fareAmount: bus.route?.fareAmount,
              type: bus.route?.type || 'fixed'
            });
          }
        });
      }

      setAllTaxis(taxis);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const defaultPosition = [0.3136, 32.5811];

    mapRef.current = L.map(mapContainerRef.current).setView(defaultPosition, 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(mapRef.current);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          mapRef.current.setView([latitude, longitude], 14);
          L.marker([latitude, longitude], {
            icon: L.icon({
              iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
            })
          }).addTo(mapRef.current).bindPopup('Your Location').openPopup();
        }
      );
    }
  }, []);

  useEffect(() => {
    const filtered = !searchQuery
      ? allTaxis
      : allTaxis.filter(taxi =>
          taxi.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
          taxi.departure.toLowerCase().includes(searchQuery.toLowerCase())
        );
    setFilteredTaxis(filtered);
  }, [searchQuery, allTaxis]);
  const formatRoutePath = (route) => {
            const departure = route?.departure || 'Unknown';
            const destination = route?.destination || 'Unknown';

            if (route?.type === 'dynamic' && route?.vias?.length) {
              const vias = route.vias;
              const prices = route.viaPrices || [];

              const formattedVias = vias.map((via, idx) => {
                const price = prices[idx] || 0;
                return `${via} (${price} UGX)`;
              }).join(' → ');

              return `${departure} → ${formattedVias} → ${destination}`;
            }

            return `${departure} → ${destination}`;
          };

  useEffect(() => {
    if (!mapRef.current) return;

    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    filteredTaxis.forEach(taxi => {
      const { latitude, longitude } = taxi.location;
      // const prices = taxi.route.viaPrices || [];
      

      const fullRoute=formatRoutePath(taxi.route)

      const marker = L.marker([latitude, longitude], {
        icon: L.icon({
          iconUrl: 'front-of-bus.png',
          iconSize: [25, 25],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
        })
      }).addTo(mapRef.current)
        .bindPopup(`
          <b>Bus ID:</b> ${taxi.id}<br/>
          <b>Route Type:</b> ${taxi.type}<br/>
          <b>Route:</b> ${fullRoute}<br/>
          ${taxi.fareAmount ? `<b>Fare:</b> ${taxi.fareAmount} UGX` : ''}
        `);

      markersRef.current.push(marker);
    });

    if (filteredTaxis.length > 1) {
      const bounds = L.latLngBounds(
        filteredTaxis.map(t => [t.location.latitude, t.location.longitude])
      );
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [filteredTaxis]);

  return (
    <div className="container">
      <Header onProfileClick={() => navigate('/profile')} />
      <main>
        <div className="page">
          <div className="title">
            <button onClick={() => navigate('/')}>
              <i className='bx bxs-left-arrow-circle'></i>
            </button>
            <h2>Find a Taxi Bus</h2>
          </div>

          <div className="search-container">
            <i className='bx bx-search search-icon'></i>
            <input
              type="text"
              placeholder="Filter by destination or departure..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {loading ? (
            <div className="loading-message">Loading taxi locations...</div>
          ) : filteredTaxis.length === 0 ? (
            <div className="no-results">
              {allTaxis.length === 0
                ? 'No available taxi buses at this time.'
                : 'No taxis found for this route.'}
            </div>
          ) : null}

          <div
            id="map"
            ref={mapContainerRef}
            style={{ height: '500px', width: '100%' }}
          />

          <div className="taxi-list">
            {filteredTaxis.slice(0, 5).map(taxi => (
              <div key={taxi.id} className="taxi-card">
                <div className="taxi-info">
                  <h4>{taxi.id}</h4>
                  {/* <p>{taxi.departure} → {taxi.destination}</p>
                  {taxi.vias && taxi.vias.length > 0 && (
                    <p>Via: {taxi.vias.map(v => v.name).join(', ')}</p>
                  )} */}
                  <p>{formatRoutePath(taxi.route)}</p>
                  <p>Fare: {taxi.fareAmount || 'N/A'} UGX</p>
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

