export interface StrapiImageFormat {
  url: string
  width: number
  height: number
}

export interface StrapiImage {
  url: string
  alternativeText: string | null
  formats?: {
    large?: StrapiImageFormat
    medium?: StrapiImageFormat
    small?: StrapiImageFormat
    thumbnail?: StrapiImageFormat
  }
}

export interface FirstCard {
  id: number
  Cardtitle: string
  CardDescription: string
  CardButtonLabel: string
  CardButtonLink: string
}

export interface JoinCard {
  id: number
  Heading: string
  Description: string
  Link: string | null
}

export interface SecondCard {
  Image: StrapiImage
}

export interface JoinSectionData {
  SectionTitle: string
  FirstCard: FirstCard
  SecondCard: SecondCard
  ThirdCards: JoinCard[]
}
