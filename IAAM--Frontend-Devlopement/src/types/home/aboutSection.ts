export interface RichTextBlock {
  type: string;
  children: { type: string; text: string }[];
}

export interface Media {
  url: string;
  alternativeText?: string | null;
}

export interface AboutCard {
  id: number;
  title: string;
  description: RichTextBlock[];
}

export interface AboutSectionData {
  title: string;
  description: RichTextBlock[];
  buttonText: string;
  buttonLink: string;
  image: Media;
  about_cards: AboutCard[];
}
