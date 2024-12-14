import { Avatar } from '@mantine/core';
import { FaWalking, FaRunning, FaSwimmer, FaDumbbell, FaHiking, FaBicycle, FaMountain, FaSkating, FaBalanceScale, FaMusic, FaHandHolding, FaPersonBooth, FaWater, FaPlane, FaShip, FaCar, FaMotorcycle, FaTrain } from 'react-icons/fa';
import { MdOutlineDirectionsBus, MdOutlineFitnessCenter, MdSportsGymnastics } from 'react-icons/md';

export const travelImages = ["/travel_1.jpg", "/travel_2.jpg", "/travel_3.jpg"]


const getActivityIcon = (activityName: string) => {
  const activityIcons: { [key: string]: React.ReactNode } = {
    Caminar: <FaWalking />,
    Bailar: <FaMusic />,
    Correr: <FaRunning />,
    Nadar: <FaSwimmer />,
    Entrenar: <FaDumbbell />,
    Senderismo: <FaHiking />,
    Atletismo: <FaRunning />,
    Pilates: <MdOutlineFitnessCenter />,
    Escalar: <FaMountain />,
    Patinar: <FaSkating />,
    Ciclismo: <FaBicycle />,
    Boxeo: <FaHandHolding />,
    Esgrima: <FaPersonBooth />,
    Gimnasia: <MdSportsGymnastics />,
    'Remo en canoa': <FaWater />
  };

  return activityIcons[activityName] || <FaBalanceScale />;
};

const getActivityColor = (activityName: string) => {
  const activityColors: { [key: string]: string } = {
    Caminar: 'blue',
    Bailar: 'pink',
    Correr: 'red',
    Nadar: 'cyan',
    Entrenar: 'green',
    Senderismo: 'orange',
    Atletismo: 'teal',
    Pilates: 'purple',
    Escalar: 'gray',
    Patinar: 'yellow',
    Ciclismo: 'lime',
    Boxeo: 'indigo',
    Esgrima: 'violet',
    Gimnasia: 'grape',
    'Remo en canoa': 'brown',
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

