import React, { useEffect, useRef } from 'react';
import { loadYmaps } from '../Maps/loadYMaps';

const MapInput = ({ onLocationChange, initialCoords = [55.753215, 37.622415] }) => {
  const mapRef = useRef(null);
  const placemarkRef = useRef(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    const init = async () => {
      if (initializedRef.current) return;

      await loadYmaps();
      initMap();
      initializedRef.current = true;
    };

    const initMap = () => {
      const mapInstance = new window.ymaps.Map("map-input", {
        center: initialCoords,
        zoom: 10,
        controls: ['zoomControl', 'fullscreenControl']
      });

      mapRef.current = mapInstance;

      const placemark = new window.ymaps.Placemark(initialCoords, {}, {
        preset: 'islands#blueDotIcon',
        draggable: true
      });

      placemarkRef.current = placemark;
      mapInstance.geoObjects.add(placemark);

      const updateCoordinates = (coords) => {
        const coordsString = `${coords[0].toFixed(6)}, ${coords[1].toFixed(6)}`;
        onLocationChange(coordsString);
      };

      placemark.events.add('dragend', () => {
        updateCoordinates(placemark.geometry.getCoordinates());
      });

      mapInstance.events.add('click', (e) => {
        const newCoords = e.get('coords');
        placemark.geometry.setCoordinates(newCoords);
        updateCoordinates(newCoords);
      });
    };

    init();

    return () => {
      if (mapRef.current) {
        mapRef.current.destroy();
        mapRef.current = null;
      }
      initializedRef.current = false;
    };
  }, [initialCoords, onLocationChange]);

  return (
    <div style={{ width: '100%', height: '300px', marginBottom: '1rem' }}>
      <label>Выберите место на карте:</label>
      <div id="map-input" style={{ width: '100%', height: '100%' }}></div>
    </div>
  );
};

export default MapInput;