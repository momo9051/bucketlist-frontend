export interface BucketListItem {
  id: string;
  userId: string;
  username: string;
  title: string;
  description: string | null;
  completed: boolean;
  createdAt: string;
  giphyUrl: string | null;
  photoUrl: string | null;
}

export interface BucketListItemRequest {
  title: string;
  description?: string | null;
  giphyUrl?: string | null;
}

export interface BucketListItemUpdate {
  title: string;
  description?: string | null;
  completed: boolean;
  giphyUrl?: string | null;
}

export interface GiphyGif {
  id: string;
  title?: string;
  previewUrl: string;
  originalUrl: string;
}
