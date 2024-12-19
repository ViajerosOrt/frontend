import L from 'leaflet';

class IconManager {

/*
Method used by Map.tsx line 168
Given the type names that we got from overpass-api, we can map them with an icon
*/

  static getIcon(name: string): L.Icon {

    const iconMap: { [key: string]: string } = {

    "restaurant": "/Map/restaurant.png",
    "museum": "/Map/museum.png",
    "park": "/Map/park.png",
    "garden": "/Map/garden.png",
    "social_club": "/Map/socialClub.png",
    "clubs": "/Map/socialClub.png",
    "bar": "/Map/bar.png",
    "library": "/Map/books.png",
    "place_of_worship": "/Map/church.png",
    "church": "/Map/church.png",
    "tennis": "/Map/tenis.png",
    "soccer": "/Map/futbol.png",
    "sports_centre": "/Map/futbol.png",
    "skatepark": "/Map/skate.png",
    "skateparks": "/Map/skate.png",
    "aquarium": "/Map/acuarium.png",
    "zoo": "/Map/zoo.png",
    "playground": "/Map/playground.png",
    "karaoke": "/Map/karaoke.png",
    "nightclub": "/Map/nightclub.png",
    "dance": "/Map/nightclub.png",
    "yoga": "/Map/meditation.png",
    "spa": "/Map/massage.png",
    "massage": "/Map/massage.png",
    "massages": "/Map/massage.png",
    "fishing": "/Map/fishing.png",
    "trail": "/Map/hiking.png",
    "cycleway": "/Map/cycling.png",
    "cinema": "/Map/cinema.png",
    "casino": "/Map/casino.png",
    "beach": "/Map/beach.png",
    "botanical_garden": "/Map/botanical.png",
    "botanical": "/Map/botanical.png",
    "theatre": "/Map/theatre.png",
    "gallery": "/Map/art.png",
    "fitness_centre": "/Map/gym.png",
    "fitness_station": "/Map/gym.png",
    "stadium": "/Map/stadium.png",
    "pub": "/Map/pub.png",
    "pitch": "/Map/pitch.png",
    "track": "/Map/trail.png",
    "dojo": "/Map/karate.png",
    "trails": "/Map/trail.png",
    };
   
    const iconUrl = iconMap[name] ||'/marker.png';

    //FS 09/12/2024 Added to see which icons we need to add, do not remove! 
    if (!iconUrl || iconUrl === '/marker.png') {
        console.log('Missing icon:', name);
    }

    return new L.Icon({
      iconUrl,
      iconSize: [25, 25],
      iconAnchor: [12, 28],
      popupAnchor: [0, -25],
    });
  }
}
export default IconManager;

/*
Const used to enable or disable all the filter options in the map
NOTE: If we want to disable restaurants by default, set it false
*/
export const DEFAULT_ICONS = {
  restaurant: false,
  museum: true,
  park: true,
  garden: false,
  clubs: false,
  bar: true,
  library: true,
  church: false,
  tennis: false,
  soccer: false,
  skateparks: false,
  aquarium: true,
  zoo: true,
  playground: false,
  karaoke: true,
  nightclub: true,
  dance: false,
  yoga: false,
  spa: false,
  massages: false,
  fishing: false,
  trails: false,
  cycleway: false,
  cinema: false,
  casino: true,
  beach: true,
  botanical: true,
  theatre: true,
  gallery: true,
};

export type DefaultIcons = { [key: string]: boolean };



export const markerIcon = new L.Icon({
  iconUrl: '/marker.png',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});