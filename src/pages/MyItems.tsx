import { useEffect, useMemo, useState } from "react";
import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router-dom";
import { ItemCard } from "../components/bucketlist/ItemCard";
import { ItemDetailModal } from "../components/bucketlist/ItemDetailModal";
import { useBucketlistService } from "../services/bucketlistService";
import type { BucketListItem } from "../types";

export const MyItems = () => {
  const { getMyItems, remove, updateStatus, uploadProof } = useBucketlistService();
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
      const data = await getMyItems();
      setItems(data);
    } catch (e) {
      setError("Kon mijn bucketlist items niet laden.");
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

  const todos = items.filter((it) => !it.completed);
  const dones = items.filter((it) => it.completed);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Mijn items</h1>
        <button
          onClick={() => navigate("/bucketlist/create")}
          className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition"
        >
          Maak bucketlist item
        </button>
      </div>
      <div className="flex justify-end">
        <button
          onClick={() => navigate("/bucketlist")}
          className="text-sm px-3 py-1.5 rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200 transition"
        >
          Terug naar overzicht
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
              className="w-full h-64 rounded-lg bg-gray-100 animate-pulse"
            />
          ))}
        </div>
      ) : (
        <>
          <section className="space-y-4">
            <h2 className="text-xl font-bold mb-2">Nog te doen</h2>
            {todos.length === 0 ? (
              <p className="text-gray-600">Geen openstaande items.</p>
            ) : (
              <div className="columns-1 md:columns-2 lg:columns-3 gap-4">
                {todos.map((item) => (
                  <div key={item.id} className="mb-4" style={{ breakInside: "avoid" }}>
                    <ItemCard item={item} onClick={() => setSelectedItem(item)} />
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold mb-2">Voltooid</h2>
            {dones.length === 0 ? (
              <p className="text-gray-600">Nog geen voltooide items.</p>
            ) : (
              <div className="columns-1 md:columns-2 lg:columns-3 gap-4">
                {dones.map((item) => (
                  <div key={item.id} className="mb-4" style={{ breakInside: "avoid" }}>
                    <ItemCard item={item} onClick={() => setSelectedItem(item)} />
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
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
          selectedItem && selectedItem.completed === false
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
