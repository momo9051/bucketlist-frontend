import { useApi } from "../hooks/useApi";
import type {
  BucketListItem,
  BucketListItemRequest,
  BucketListItemUpdate,
} from "../types";

export const useBucketlistService = () => {
  const api = useApi();

  const sortByDateDesc = (items: BucketListItem[]) =>
    [...items].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  const getAll = async (): Promise<BucketListItem[]> => {
    const { data } = await api.get<BucketListItem[]>("/api/bucketlist/all");
    return sortByDateDesc(data);
  };

  const getMyItems = async (): Promise<BucketListItem[]> => {
    const { data } = await api.get<BucketListItem[]>("/api/bucketlist");
    return sortByDateDesc(data);
  };

  const getById = async (id: string): Promise<BucketListItem> => {
    const { data } = await api.get<BucketListItem>(`/api/bucketlist/${id}`);
    return data;
  };

  const create = async (
    payload: BucketListItemRequest
  ): Promise<BucketListItem> => {
    const { data } = await api.post<BucketListItem>("/api/bucketlist", payload);
    return data;
  };

  const update = async (
    id: string,
    payload: BucketListItemUpdate
  ): Promise<BucketListItem> => {
    const { data } = await api.put<BucketListItem>(
      `/api/bucketlist/${id}`,
      payload
    );
    return data;
  };

  const remove = async (id: string): Promise<void> => {
    await api.delete(`/api/bucketlist/${id}`);
  };

  const uploadProof = async (id: string, file: File): Promise<BucketListItem> => {
    const formData = new FormData();
    formData.append("file", file);
    const { data } = await api.post<BucketListItem>(
      `/api/bucketlist/${id}/proof`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return data;
  };

  const updateStatus = async (
    id: string,
    completed: boolean
  ): Promise<BucketListItem> => {
    // 1) haal huidige velden op
    const current = await getById(id);
    // 2) PUT met bestaande velden + nieuw completed
    const { data } = await api.put<BucketListItem>(`/api/bucketlist/${id}`, {
      title: current.title,
      description: current.description,
      giphyUrl: current.giphyUrl,
      completed,
    });
    return data;
  };

  return {
    getAll,
    getMyItems,
    getById,
    create,
    update,
    remove,
    uploadProof,
    updateStatus,
  };
};
