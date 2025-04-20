import { create } from "zustand";

interface Course {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  price: string;
  coverImage: string;
  introVideo: string;
  createdAt: string;
  updatedAt: string;
  level: string;
  certificateTitle: string;
  certificateDescription: string;
  certificateBackground: string;
}

interface Page {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  permalink: string;
  image: string;
  blurb: string;
  isProtected: boolean;
}

interface Feature {}

interface Layout {}

interface extraRegistrationField {
  text: string;
  type: string;
  required: boolean;
}

interface Site {
  name: string;
  logo: string;
  domainName: string;
  customDomain: string;
  themeName: string;
  courses: Course[];
  pages: Page[];
  features: Feature[];
  isActive: boolean;
  frontendConfig: string;
  layout: Layout;
  extraRegistrationFields: extraRegistrationField[];
}

interface SiteStore {
  site: Site | null;
}

export const useSiteStore = create<SiteStore>((set) => ({
  site: null,
}));
