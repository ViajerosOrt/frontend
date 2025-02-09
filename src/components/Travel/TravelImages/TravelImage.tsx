import { Image } from "@mantine/core";

type TravelImageProps = {
  src: string;
  alt: string;
};

const TravelImage = ({ src, alt }: TravelImageProps) => {


  return (
    <Image
      src={src}
      alt={alt}
      fallbackSrc="/travel_3.jpg"
      height={200}
      style={{ objectFit: "cover", minHeight: '200px', height: '200px' }}
    />
  );
};

export default TravelImage;