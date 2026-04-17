export interface ImpactPoint {
  id: number;
  text: string;
}

export interface GlobalImpactImage {
  url: string;
  width: number;
  height: number;
}

export interface AssociationGlobalImpact {
  sectionTitle: string;
  sectionSubtitle: string;
  impactTitle: string;
  impactIntro: string;
  image: GlobalImpactImage;
  ImpactPoint: ImpactPoint[];
}
