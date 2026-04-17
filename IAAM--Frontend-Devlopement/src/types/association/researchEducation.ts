export interface ResearchPoint {
  id: number;
  text: string;
}

export interface ResearchEducationSectionData {
  title: string;
  intro: string;
  image: {
    url: string;
    width: number;
    height: number;
  };
  ResearchPoint: ResearchPoint[];
}
