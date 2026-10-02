import type { ComponentType } from "react";
import AboutPage from "./about";
import ContactPage from "./contact";
import InsightsPage from "./insights";
import ServicesPage from "./services";
import WorkPage from "./work";

type RoutePage = {
  component: ComponentType;
  title: string;
};

export const routes: Record<string, RoutePage> = {
  about: { component: AboutPage, title: "About" },
  contact: { component: ContactPage, title: "Contact" },
  insights: { component: InsightsPage, title: "Insights" },
  services: { component: ServicesPage, title: "Services" },
  work: { component: WorkPage, title: "Work" },
};
