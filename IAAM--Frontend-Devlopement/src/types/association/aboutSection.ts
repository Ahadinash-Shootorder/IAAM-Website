export interface RichTextBlock {
  type: string;
  children: { type: string; text: string }[];
}

export interface AssociationAboutData {
  title: string;
  paragraph1: RichTextBlock[];
  paragraph2: RichTextBlock[];
}
