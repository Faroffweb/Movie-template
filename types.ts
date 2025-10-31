export interface DownloadLink {
  provider: string;
  url: string;
  type: 'G-Direct [Instant]' | 'V-Cloud [Resumable]' | 'Batch/Zip' | 'GDTot [G-Drive]';
  size: string;
}

export interface DownloadSection {
  title: string;
  links: DownloadLink[];
}


export interface Content {
  id: number;
  created_at?: string;
  contentType: 'Movie' | 'Web Series';
  title: string;
  description: string;
  posterUrl: string;
  releaseDate: string;
  quality: 'WEB-DL' | 'Blu-Ray';
  genres: string[];
  downloadSections?: DownloadSection[];
}