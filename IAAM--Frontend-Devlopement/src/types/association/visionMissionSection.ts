export type MissionPoint = {
  id: number;
  text: string;
};

export type VisionMissionData = {
  sectionTitle: string;
  sectionSubtitle: string;
  visionTitle: string;
  visionDescription: any[];
  missionTitle: string;
  missionIntro: string;
  MissionPoint: MissionPoint[];
};