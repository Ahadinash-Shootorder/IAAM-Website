export interface GlobalCommunityPoint {
  text: string;
}

export interface GlobalCommunitySectionData {
  title: string;
  intro: string;
  closingText: string;
  image: {
    url: string;
    width: number;
    height: number;
  };
  CommunityPoint: GlobalCommunityPoint[];
}
