export interface LeadershipPoint {
  id: number;
  text: string;
}

export interface LeadershipImage {
  url: string;
  width: number;
  height: number;
}

export interface LeadershipSectionData {
  title: string;
  description: any[];
  image: LeadershipImage;
  LeadershipPoint: LeadershipPoint[];
}
