import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import { ItemCard } from "../components/bucketlist/ItemCard";
import { ItemDetailModal } from "../components/bucketlist/ItemDetailModal";
import { useBucketlistService } from "../services/bucketlistService";
import type { BucketListItem } from "../types";
import giphyLogo from "../../assets/giphy logo/GIPHY Logo 105px.png";

export const BucketlistTimeline = () => {
  const { getAll, remove, updateStatus, uploadProof } = useBucketlistService();
  const auth = useAuth();
  const navigate = useNavigate();

  const [items, setItems] = useState<BucketListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<BucketListItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isUploadingProof, setIsUploadingProof] = useState(false);

  const currentUserId = useMemo(
    () => auth.user?.profile?.sub,
    [auth.user?.profile?.sub]
  );

  const fetchItems = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getAll();
      setItems(data);
    } catch (e) {
      setError("Kon bucketlist items niet laden.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchItems();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Weet je zeker dat je dit item wilt verwijderen?");
    if (!confirmed) return;
    try {
      setIsDeleting(true);
      await remove(id);
      setItems((prev) => prev.filter((it) => it.id !== id));
      setSelectedItem(null);
    } catch (e) {
      setError("Verwijderen is mislukt.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleMarkComplete = async (id: string) => {
    try {
      setIsUpdatingStatus(true);
      const updated = await updateStatus(id, true);
      setItems((prev) => prev.map((it) => (it.id === id ? updated : it)));
      setSelectedItem(updated);
    } catch (e) {
      setError("Markeren als voltooid is mislukt.");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleUploadProof = async (id: string, file: File) => {
    try {
      setIsUploadingProof(true);
      const updated = await uploadProof(id, file);
      setItems((prev) => prev.map((it) => (it.id === id ? updated : it)));
      setSelectedItem(updated);
    } catch (e) {
      setError("Uploaden van bewijsfoto is mislukt.");
    } finally {
      setIsUploadingProof(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">Bucket List Timeline</h1>
          </div>
          <img src={giphyLogo} alt="GIPHY" className="h-7 w-auto" />
        </div>
        <button
          onClick={() => navigate("/bucketlist/create")}
          className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-semibold shadow-sm hover:bg-indigo-700 hover:shadow-md transition-all"
        >
          Maak bucketlist item
        </button>
      </div>

      {error && (
        <div className="p-3 rounded-md bg-red-100 text-red-700 border border-red-200">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="columns-1 sm:columns-2 xl:columns-3 2xl:columns-4 gap-5">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="w-full mb-5 h-64 rounded-xl bg-white border border-gray-200/70 shadow-sm animate-pulse"
              style={{ breakInside: "avoid" }}
            />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center text-gray-600 space-y-4 py-10">
          <p className="text-lg">Er zijn nog geen bucketlist items.</p>
          <p className="text-sm">Klik op “Maak bucketlist item” om je eerste item toe te voegen.</p>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 xl:columns-3 2xl:columns-4 gap-5">
          {items.map((item) => (
            <div key={item.id} className="mb-5" style={{ breakInside: "avoid" }}>
              <ItemCard item={item} onClick={() => setSelectedItem(item)} />
            </div>
          ))}
        </div>
      )}

      <ItemDetailModal
        item={selectedItem}
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        onEdit={
          selectedItem
            ? () => navigate(`/bucketlist/edit/${selectedItem.id}`)
            : undefined
        }
        onDelete={
          selectedItem ? () => handleDelete(selectedItem.id) : undefined
        }
        isOwner={
          !!selectedItem && !!currentUserId && selectedItem.userId === currentUserId
        }
        onMarkComplete={
          selectedItem && selectedItem.completed === false && selectedItem.id
            ? () => handleMarkComplete(selectedItem.id)
            : undefined
        }
        onUploadProof={
          selectedItem && selectedItem.completed && !selectedItem.photoUrl
            ? (file) => handleUploadProof(selectedItem.id, file)
            : undefined
        }
        isUpdatingStatus={isUpdatingStatus}
        isUploadingProof={isUploadingProof}
      />

      {isDeleting && (
        <div className="fixed bottom-4 right-4 px-4 py-2 bg-gray-800 text-white rounded-md shadow">
          Verwijderen...
        </div>
      )}
    </div>
  );
};
