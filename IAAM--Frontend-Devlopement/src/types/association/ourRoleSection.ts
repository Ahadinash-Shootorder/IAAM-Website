export interface AssociationOurRole {
  title: string;
  description: {
    type: string;
    children: { type: string; text: string }[];
  }[];
  image: {
    url: string;
    width: number;
    height: number;
  };
}
