export type TravelCategory = 'natura' | 'città' | 'montagna' | 'mare';
export type TravelAspect = 'tall' | 'wide' | 'square';

export interface Country {
  name: string;
  flag: string;
  year: number;
  continent: string;
  visited: boolean;
  highlight: boolean;
  body?: unknown;
}

export interface TravelPhoto {
  id: string;
  location: string;
  country: string;
  countrySlug: string;
  year: number;
  category: TravelCategory;
  aspect: TravelAspect;
  src: string;
  alt: string;
  featured: boolean;
  body?: unknown;
}

