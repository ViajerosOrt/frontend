import { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvent } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';
import { Accordion, Box, Checkbox, Grid } from '@mantine/core';
import Icons, { DEFAULT_ICONS, DefaultIcons, markerIcon } from './MapIcons';
import { fetchCountryByName, fetchNearPlaces } from '@/utils';
import { useIsMobile } from '@/hooks/useIsMobile';

/*
Map component to given a country name, center it on the country coordinates and  when the user clicks in the map, 
shows icons of selected possible atractions (see Icons.tsx)
We use Leaflet to map rendering, openstreetmap to get the map and axios to do the geocoding
*/

type MapProps = {
  country: string;
  zoom: number;
  onLocationSelected: (location: { coordinates: [number, number], streetName: string, city: string, state: string }) => void;
  defaultCoordinates?: [number, number] | null;
};

const Map = ({ country, zoom, onLocationSelected, defaultCoordinates }: MapProps) => {
  const [coordinates, setCoordinates] = useState<[number, number] | null>(defaultCoordinates || null);
  const [userMarker, setUserMarker] = useState<[number, number] | null>(defaultCoordinates || null);
  const [nearPlaces, setNearPlaces] = useState<any[]>([]);
  const [comboIcons, setComboIcons] = useState<DefaultIcons>(DEFAULT_ICONS);
  const { isMobile } = useIsMobile();

  //Updates the state to show or hide the icons on the map
  const handleIconToggle = (iconName: string, show: boolean) => {
    setComboIcons((prev) => ({
      ...prev,
      [iconName]: show,
    }));
  };

  useEffect(() => {
    if (defaultCoordinates) {
      setCoordinates(defaultCoordinates);
      setUserMarker(defaultCoordinates);
    }
  }, [defaultCoordinates]);

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
      setUserMarker(null)
      setCoordinates(null)
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
      <Box style={{ position: 'absolute', ...(isMobile ? { bottom: 20, left: 10, right: 10, width: '200px', } : { top: 20, right: 20, width: 'auto', }), zIndex: 1000, maxHeight: '60vh', }}>
        <Accordion styles={{
          content: {
            padding: 0,
          },
        }}>
          <Accordion.Item value="options">
            <Accordion.Control
              style={{
                backgroundColor: 'rgba(101, 167, 121, 0.9)',
                padding: '12px',
                borderRadius: '10px 10px 10px 10px',
                fontWeight: 'bold',
                fontFamily: 'Poppins, sans-serif',
                fontSize: '16px',
              }}>
              Filters
            </Accordion.Control>
            <Accordion.Panel
              style={{
                backgroundColor: 'rgba(119, 165, 133, 0.8)',
                borderRadius: '10px 10px 10px 10px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}>
              <Box
                style={{
                  maxHeight: '300px',
                  overflowY: 'auto',
                  padding: '15px',
                  scrollbarWidth: 'thin',
                  scrollbarColor: 'rgba(255, 255, 255, 0.5) transparent',
                  '&::WebkitScrollbar': {
                    width: '6px',
                  },
                  '&::WebkitScrollbarTrack': {
                    background: 'transparent',
                  },
                  '&::WebkitScrollbarThumb': {
                    backgroundColor: 'rgba(255, 255, 255, 0.5)',
                    borderRadius: '3px',
                  },
                }}
              >
                <Grid gutter="xs">
                  {Object.keys(comboIcons).map((iconName) => (
                    <Grid.Col span={isMobile ? 12 : 4} key={iconName} style={{ marginBottom: isMobile ? '8px' : '5px', }}>
                      <Checkbox
                        label={
                          <Box
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                            }}
                          >
                            <img
                              src={Icons.getIcon(iconName).options.iconUrl}
                              alt={iconName}
                              style={{
                                width: '20px',
                                height: '20px',
                                flexShrink: 0,
                              }}
                            />
                            <span
                              style={{
                                textTransform: 'capitalize',
                                fontFamily: 'Poppins, sans-serif',
                                fontWeight: 'bold',
                                fontSize: isMobile ? '14px' : '16px',
                                lineHeight: '1.2',
                                wordBreak: 'break-word',
                                display: 'block',
                                color: '#fff',
                                textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                              }}
                            >
                              {iconName}
                            </span>
                          </Box>
                        }
                        checked={comboIcons[iconName]}
                        onChange={(e) => handleIconToggle(iconName, e.target.checked)}
                        styles={{
                          root: {
                            display: 'flex',
                            alignItems: 'center',
                          },
                          label: {
                            display: 'flex',
                            alignItems: 'center',
                            cursor: 'pointer',
                          },
                        }}
                      />
                    </Grid.Col>
                  ))}
                </Grid>
              </Box>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </Box>
    </Box>
  );
};

export default Map;
