import { useApi } from "../hooks/useApi";
import type { GiphyGif } from "../types";

export const useGiphyService = () => {
  const api = useApi();

  const search = async (query: string): Promise<GiphyGif[]> => {
    const { data } = await api.get<{ gifs?: GiphyGif[]; Gifs?: GiphyGif[] }>(
      `/api/giphy/search`,
      { params: { query } }
    );
    const gifs = data.gifs ?? data.Gifs ?? [];
    // Neem maximaal 4 items voor de selector
    return gifs.slice(0, 4);
  };

  return { search };
};
