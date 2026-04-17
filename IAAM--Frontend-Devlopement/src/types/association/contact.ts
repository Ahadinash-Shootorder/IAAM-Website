export interface ContactSectionData {
  headline: string;
  subTitle: string;
  description: {
    type: string;
    children: { text: string }[];
  }[];
  image: {
    url: string;
    width: number;
    height: number;
  };
}
