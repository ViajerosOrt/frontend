import { Avatar } from '@mantine/core';
import { FaWalking, FaRunning, FaSwimmer, FaDumbbell, FaHiking, FaBicycle, FaMountain, FaSkating, FaBalanceScale, FaMusic, FaHandHolding, FaPersonBooth, FaWater } from 'react-icons/fa';
import { MdOutlineFitnessCenter, MdSportsGymnastics } from 'react-icons/md';

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

export const travelImages = ["/travel_1.jpg", "/travel_2.jpg", "/travel_3.jpg"]