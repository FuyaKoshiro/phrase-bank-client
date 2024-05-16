export type Phrase = {
  id: string;
  userId: string;
  videoId: string;
  text: string;
  start: number;
  end: number;
  archivedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};
