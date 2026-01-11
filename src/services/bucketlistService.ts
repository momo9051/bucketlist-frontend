import { useApi } from "../hooks/useApi";
import type {
  BucketListItem,
  BucketListItemRequest,
  BucketListItemUpdate,
} from "../types";

export const useBucketlistService = () => {
  const api = useApi();

  const getAll = async (): Promise<BucketListItem[]> => {
    const { data } = await api.get<BucketListItem[]>("/api/bucketlist/all");
    // sort by createdAt desc for consistent timeline
    return [...data].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
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

  return {
    getAll,
    getById,
    create,
    update,
    remove,
  };
};
