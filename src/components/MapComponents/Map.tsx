import { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvent } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';
import { Accordion, Box, Checkbox, Grid } from '@mantine/core';
import Icons, { DEFAULT_ICONS, DefaultIcons, markerIcon } from './MapIcons';
import { fetchCountryByName, fetchNearPlaces } from '@/utils';

/*
Map component to given a country name, center it on the country coordinates and  when the user clicks in the map, 
shows icons of selected possible atractions (see Icons.tsx)
We use Leaflet to map rendering, openstreetmap to get the map and axios to do the geocoding
*/

type MapProps = {
  country: string;
  zoom: number;
  onLocationSelected: (location: { coordinates: [number, number], streetName: string, city: string, state: string }) => void;
};

const Map = ({ country, zoom, onLocationSelected }: MapProps) => {
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
  const [userMarker, setUserMarker] = useState<[number, number] | null>(null);
  const [nearPlaces, setNearPlaces] = useState<any[]>([]);
  const [comboIcons, setComboIcons] = useState<DefaultIcons>(DEFAULT_ICONS);


  //Updates the state to show or hide the icons on the map
  const handleIconToggle = (iconName: string, show: boolean) => {
    setComboIcons((prev) => ({
      ...prev,
      [iconName]: show,
    }));
  };

  /*Filter the places based on what the user selected in the filters combo
    We use useMemo so it only filters it when near places or combo icons changed
  */
  const filteredPlacesMemo = useMemo(() => {
    return nearPlaces.filter((place) => comboIcons[place.type] === true);
  }, [nearPlaces, comboIcons]);


  //We obtain the coordinates
  useEffect(() => {
    if (country) {
      fetchCountryByName(country).then(setCoordinates).catch(console.error);
    }
  }, [country]);


  //When the user clicks on the map, we get the coordinates, place a marker and get the near places of that long /lat
  const MapClickHandler = () => {
    useMapEvent('click', async (event: L.LeafletMouseEvent) => {
      const { lat, lng } = event.latlng;

      //We use openstreetmap again to make a reverse with the given lat and long, so we can get address, city, state, etc
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`
      );
      const address = response.data.address || '';
      const streetName = address?.road || '';
      const city = address?.city || address?.town || '';
      const state = address?.state || '';

      setUserMarker([lat, lng]);

      onLocationSelected({
        coordinates: [lat, lng],
        streetName,
        city,
        state,
      });

      fetchNearPlaces(lat, lng).then(setNearPlaces).catch(console.error);
    });

    return null;
  };

  if (!coordinates) {
    return <div>Select a country!</div>;
  }

  /*Updates the map when the cordinates changes, TODO: iam pretty sure there is a better way to do this,
  but i had a bug where the map keep updating when i clicked in the map, thats why we use !userMarker const
  in the useEffect below happened the same thing
 */
  const UpdateMap = () => {
    const map = useMap();

    useEffect(() => {
      if (coordinates && !userMarker) {
        map.setView(coordinates, zoom);
      }
    }, [coordinates, zoom, map, userMarker]);

    return null;
  };

  return (
    <Box style={{ height: '500px', width: '100%', position: 'relative', zIndex: 1 }}>
      <MapContainer center={coordinates} zoom={zoom} style={{ height: '100%', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <UpdateMap />
        <MapClickHandler />
        {userMarker && (
          <Marker position={userMarker} icon={markerIcon}>
            <Popup>{country}</Popup>
          </Marker>
        )}
        {filteredPlacesMemo.map((place) => (
          <Marker key={place.id} position={[place.lat, place.lng]} icon={Icons.getIcon(place.type)}>
            <Popup>{place.name}</Popup>
          </Marker>
        ))}
      </MapContainer>
      <Box style={{ position: 'absolute', top: 20, right: 20, zIndex: 1000 }}>
        <Accordion>
          <Accordion.Item value="options">
            <Accordion.Control
              style={{
                backgroundColor: 'rgba(101, 167, 121, 0.6)',
                padding: '12px 16px',
                borderRadius: '10px',
                fontWeight: 'bold',
                fontFamily: 'Poppins, sans-serif',
                fontSize: '16px',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(8px)',
              }}>
              Filters
            </Accordion.Control>
            <Accordion.Panel
              style={{
                backgroundColor: 'rgba(119, 165, 133, 0.5)',
                padding: '20px',
                borderRadius: '10px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              }}>
              <Grid gutter="xs">
                {Object.keys(comboIcons).map((iconName) => (
                  <Grid.Col span={4} key={iconName}>
                    <Checkbox
                      label={
                        <Box
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                          }}
                        >
                          <img
                            src={Icons.getIcon(iconName).options.iconUrl}
                            alt={iconName}
                            style={{
                              width: '20px',
                              height: '20px',
                            }}
                          />
                          <span
                            style={{
                              textTransform: 'capitalize',
                              fontFamily: 'Poppins, sans-serif',
                              fontWeight: 'bold',
                            }}
                          >
                            {iconName}
                          </span>
                        </Box>
                      }
                      checked={comboIcons[iconName]}
                      onChange={(e) => handleIconToggle(iconName, e.target.checked)}
                    />
                  </Grid.Col>
                ))}
              </Grid>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </Box>
    </Box>
  );
};

export default Map;
