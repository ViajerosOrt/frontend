import { Image } from "@mantine/core";

type TravelImageProps = {
  src: string;
  alt: string;
};

const TravelImage = ({ src, alt }: TravelImageProps) => {


  return (
    <Image
      src={src}
      fallbackSrc="https://via.placeholder.com/200"
      alt={alt}
      height={200}
      style={{ objectFit: "cover", minHeight: '200px', height: '200px' }}
    />
  );
};

export default TravelImage;