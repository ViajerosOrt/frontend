export const VIAJERO_GREEN = "#65a773";
export const VIAJERO_GREEN_LIGHT = "#8acc98";
export const VIAJERO_GREEN_DARK = "#4e7857";
export const VIAJERO_YELLOW = "#bec440";
export const VIAJERO_RED = "#9b0d0d";
export const ANIMATIONS = {
  breathing: 'breathing 2.5s ease-in-out infinite',
  moving: 'moving 3s ease-in-out infinite',
  fly: 'planeFly 9s ease-in-out infinite'
};

export class Consts {
  
    static getColorByPercentage(usersCount: number, maxCap: number): string {
      const percentage = (usersCount / maxCap) * 100;
  
      if (percentage >= 80 ) {
        return VIAJERO_RED;
      }
  
      if (percentage >= 50 && percentage <= 80) {
        return VIAJERO_YELLOW;
      }
  
      return VIAJERO_GREEN;
    }
  }