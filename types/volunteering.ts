export interface VolunteeringProject {
  title: string;
  slug: string;
  tag: string;
  tech: string[];
  link?: string;
  facebook?: string;
  instagram?: string;
  github?: string;
  order?: number;
}

export type TimelineChip = 'Operativo' | 'Gestionale' | 'Comunicazione';

export interface VolunteeringTimelineItem {
  year: string;
  titleKey: string;
  descriptionKey: string;
  icon: string;
  chip: TimelineChip;
}

export interface TimelineItem {
  year: string;
  icon: string;
  titleKey: string;
  descriptionKey: string;
  chipKey: string;
  chipColor: string;
}
