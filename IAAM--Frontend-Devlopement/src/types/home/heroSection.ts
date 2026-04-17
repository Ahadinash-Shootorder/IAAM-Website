export interface ImageObject {
  id: number;
  documentId: string;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  url: string;
  formats?: {
    thumbnail?: { url: string };
    small?: { url: string };
    medium?: { url: string };
    large?: { url: string };
  };
}

export interface HeroBannerData {
  id: number;
  HeroBannerTitle: string;
  HeroBannerDescription: string;
  HeroBannerButtonLabel: string;
  HeroBanner?: ImageObject;
  Links?: Array<any>;
}

export interface HeroData {
  HeroBanner?: HeroBannerData;
}