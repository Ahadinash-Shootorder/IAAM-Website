export interface StrapiImageFormat {
  url: string;
  width: number;
  height: number;
}

export interface StrapiImage {
  url: string;
  formats: {
    thumbnail?: StrapiImageFormat;
    small?: StrapiImageFormat;
    medium?: StrapiImageFormat;
    large?: StrapiImageFormat;
  };
}

export interface AssociationHeroData {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  backgroundImage: StrapiImage;
}
