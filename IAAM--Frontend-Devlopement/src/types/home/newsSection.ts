export interface RichTextBlock {
  type: string;
  children: { type: string; text: string }[];
}

export interface NewsItem {
  id: number;
  title: string;
  date: string;
  link: string;
}

export interface Media {
  url: string;
  alternativeText?: string | null;
}

export interface NewsSectionData {
  id: number;
  title: string;
  subtitle: string;
  newsletterButtonText: string;
  newsletterButtonLink: string;
  allArticlesText: RichTextBlock[];
  allArticlesLink: string;
  featuredTitle: string;
  featuredDescription: RichTextBlock[];
  featuredImage: Media;
  newsItems: NewsItem[];
}
