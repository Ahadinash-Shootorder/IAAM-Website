export interface PriorityPoint {
  id: number;
  text: string;
}

export interface StrategicPrioritiesSectionData {
  title: string;
  intro: string;
  image: {
    url: string;
    width: number;
    height: number;
  };
  PriorityPoint: PriorityPoint[];
}
