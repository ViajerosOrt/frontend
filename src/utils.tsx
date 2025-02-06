import { Avatar, Group } from '@mantine/core';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { FaWalking, FaRunning, FaSwimmer, FaDumbbell, FaHiking, FaBicycle, FaMountain, FaSkating, FaBalanceScale, FaMusic, FaHandHolding, FaPersonBooth, FaWater, FaPlane, FaShip, FaCar, FaMotorcycle, FaTrain } from 'react-icons/fa';
import { MdOutlineDirectionsBus, MdOutlineFitnessCenter, MdSportsGymnastics } from 'react-icons/md';

export const travelImages = ["/travel_1.jpg", "/travel_2.jpg", "/travel_3.jpg"]


const getActivityIcon = (activityName: string) => {
  const activityIcons: { [key: string]: React.ReactNode } = {
    Walking: <FaWalking />,
    Dancing: <FaMusic />,
    Running: <FaRunning />,
    Swimming: <FaSwimmer />,
    Training: <FaDumbbell />,
    Hiking: <FaHiking />,
    Athletics: <FaRunning />,
    Pilates: <MdOutlineFitnessCenter />,
    Climbing: <FaMountain />,
    Skating: <FaSkating />,
    Cycling: <FaBicycle />,
    Boxing: <FaHandHolding />,
    Fencing: <FaPersonBooth />,
    Gymnastics: <MdSportsGymnastics />,
    'Canoeing': <FaWater />
  };

  return activityIcons[activityName] || <FaBalanceScale />;
};

const getActivityColor = (activityName: string) => {
  const activityColors: { [key: string]: string } = {
    Walking: 'blue',
    Dancing: 'pink',
    Running: 'red',
    Swimming: 'cyan',
    Training: 'green',
    Hiking: 'orange',
    Athletics: 'teal',
    Pilates: 'purple',
    Climbing: 'gray',
    Skating: 'yellow',
    Cycling: 'lime',
    Boxing: 'indigo',
    Fencing: 'violet',
    Gymnastics: 'grape',
    'Canoeing': 'brown',
  };

  return activityColors[activityName] || 'gray';
};

export const getActivityAvatar = (activityName: string, avatarSize: string | number = 'md') => {
  return (
    <Avatar
      color={getActivityColor(activityName)}
      size={avatarSize}
      radius="xl"
      key={activityName}
    >
      {getActivityIcon(activityName)}
    </Avatar>
  );
};

const getTransportIcon = (transportName: string): React.ReactNode => {
  const transportIcons: { [key: string]: React.ReactNode } = {
    Plane: <FaPlane />,
    Ship: <FaShip />,
    Car: <FaCar />,
    Motorbike: <FaMotorcycle />,
    Train: <FaTrain />,
    Bus: <MdOutlineDirectionsBus />,
  };

  return transportIcons[transportName] || <FaCar />;
};

const getTransportColor = (transportName: string): string => {
  const transportColors: { [key: string]: string } = {
    Plane: 'blue',
    Ship: 'teal',
    Car: 'red',
    Motorbike: 'orange',
    Train: 'gray',
    Bus: 'yellow',
  };

  return transportColors[transportName] || 'gray';
};

export const getTransportAvatar = (
  transportName: string,
  avatarSize: string | number = 'md'
): JSX.Element => {
  return (
    <Avatar
      color={getTransportColor(transportName)}
      size={avatarSize}
      radius="xl"
      key={transportName}
    >
      {getTransportIcon(transportName)}
    </Avatar>
  );
};

export function getDaysPending(date: Date): number {
  const today = new Date();
  const startDate = new Date(date);
  const daysPending = Math.ceil((startDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)); // Difference in days
  return daysPending;
}

//Finds the coordinates given the country name
export const fetchCountryByName = async (countryName: string): Promise<[number, number]> => {
  try {
    const response = await axios.get(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`);
    const countryData = response.data[0];
    const lat = countryData.latlng[0];
    const lng = countryData.latlng[1];
    return [lat, lng];
  } catch (error) {
    console.error('Error fetching country:', error);
    throw error;
  }
};

//Overpass-api to get all of the near places (that we want) in the given coordinates
export const fetchNearPlaces = async (lat: number, lng: number) => {
  const query = `
    [out:json];
    (
      node["amenity"="restaurant"](around:6000, ${lat}, ${lng});
      node["tourism"="museum"](around:6000, ${lat}, ${lng});
      node["leisure"="park"](around:6000, ${lat}, ${lng});
      node["landuse"="garden"](around:6000, ${lat}, ${lng});
      node["leisure"="social_club"](around:6000, ${lat}, ${lng});
      node["amenity"="bar"](around:6000, ${lat}, ${lng});
      node["amenity"="library"](around:6000, ${lat}, ${lng});
      node["amenity"="place_of_worship"](around:6000, ${lat}, ${lng});
      node["leisure"="sports_centre"]["sport"="tennis"](around:6000, ${lat}, ${lng});
      node["leisure"="sports_centre"]["sport"="soccer"](around:6000, ${lat}, ${lng});
      node["leisure"="skatepark"](around:6000, ${lat}, ${lng});
      node["tourism"="aquarium"](around:6000, ${lat}, ${lng});
      node["tourism"="zoo"](around:6000, ${lat}, ${lng});
      node["amenity"="playground"](around:6000, ${lat}, ${lng});
      node["amenity"="karaoke"](around:6000, ${lat}, ${lng});
      node["amenity"="nightclub"](around:6000, ${lat}, ${lng});
      node["amenity"="dance"](around:6000, ${lat}, ${lng});
      node["amenity"="nightclub"](around:6000, ${lat}, ${lng});
      node["amenity"="gym"]["sport"="yoga"](around:6000, ${lat}, ${lng});
      node["amenity"="spa"](around:6000, ${lat}, ${lng});
      node["amenity"="massage"](around:6000, ${lat}, ${lng});
      node["leisure"="fishing"](around:6000, ${lat}, ${lng});
      node["tourism"="trail"](around:6000, ${lat}, ${lng});
      node["tourism"="cycleway"](around:6000, ${lat}, ${lng});
      node["sport"](around:6000, ${lat}, ${lng});
      node["amenity"="cinema"](around:6000, ${lat}, ${lng});
      node["amenity"="casino"](around:6000, ${lat}, ${lng});
      node["natural"="beach"](around:6000, ${lat}, ${lng});
      node["tourism"="botanical_garden"](around:6000, ${lat}, ${lng});
      node["amenity"="theatre"](around:6000, ${lat}, ${lng});
      node["tourism"="gallery"](around:6000, ${lat}, ${lng});
    );
    out body;
  `;

  try {
    const response = await axios.get('https://overpass-api.de/api/interpreter', {
      params: { data: query }
    });

    const places = response.data.elements
      .filter((element: { lat: any; lon: any; }) => element.lat && element.lon)
      .map((element: { id: any; lat: any; lon: any; tags: { [x: string]: any; name: any; }; }) => {

        const type = element.tags['amenity'] || element.tags['tourism'] || element.tags['leisure'] || element.tags['historic'] || element.tags['natural'] || '';
        return { id: element.id, lat: element.lat, lng: element.lon, name: element.tags.name, type: type };

      });

    return places;
  } catch (error) {
    console.error('Error fetching near places:', error);
    throw error;
  }
};



export const CountryFlag = ({ country }: { country: string }) => {
  const [flag, setFlag] = useState<string | null>(null);

  useEffect(() => {
    const fetchFlag = async () => {
      try {
        const response = await axios.get(`https://restcountries.com/v3.1/name/${country}?fullText=true`);

        const countryData = response.data[0];
        setFlag(countryData.flags.svg);
      } catch (error) {
        console.error("Error getting the flag:", error);
      }
    };

    fetchFlag();
  }, [country]);

  return (
    <Group gap={1}>
      {flag && (
        <img
          src={flag}
          alt={country}
          style={{ width: 50, height: 20, objectFit: 'contain' }}
        />
      )}
      <span>{country}</span>
    </Group>
  );
};
