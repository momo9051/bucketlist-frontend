import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import { ItemCard } from "../components/bucketlist/ItemCard";
import { ItemDetailModal } from "../components/bucketlist/ItemDetailModal";
import { useBucketlistService } from "../services/bucketlistService";
import type { BucketListItem } from "../types";
import giphyLogo from "../../assets/giphy logo/GIPHY Logo 105px.png";

export const BucketlistTimeline = () => {
  const { getAll, remove } = useBucketlistService();
  const auth = useAuth();
  const navigate = useNavigate();

  const [items, setItems] = useState<BucketListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<BucketListItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold text-gray-900">Bucket List Timeline</h1>
          <img src={giphyLogo} alt="GIPHY" className="h-6 w-auto" />
        </div>
        <button
          onClick={() => navigate("/bucketlist/create")}
          className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="h-64 rounded-lg bg-gray-100 animate-pulse"
            />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center text-gray-600 space-y-4 py-10">
          <p className="text-lg">Er zijn nog geen bucketlist items.</p>
          <p className="text-sm">Klik op “Maak bucketlist item” om je eerste item toe te voegen.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onClick={() => setSelectedItem(item)}
            />
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
      />

      {isDeleting && (
        <div className="fixed bottom-4 right-4 px-4 py-2 bg-gray-800 text-white rounded-md shadow">
          Verwijderen...
        </div>
      )}
    </div>
  );
};
