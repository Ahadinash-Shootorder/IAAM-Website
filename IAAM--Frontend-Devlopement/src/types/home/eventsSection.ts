// Event item
export interface EventItem {
  id: number;
  month: string;
  day: string;
  title: string;
  description: string;
}

// Left submit section
export interface LeftSubmit {
  id: number;
  title: string;
  paragraph1: string;
  paragraph2: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
}

// Events section main
export interface EventsSectionData {
  id: number;
  title: string;
  events: EventItem[];
  leftSubmit: LeftSubmit[];
}

// API Response shape
export interface HomePageResponse {
  data: {
    id: number;
    eventsSection: EventsSectionData;
  }[];
}
