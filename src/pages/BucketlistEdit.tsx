import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useBucketlistService } from "../services/bucketlistService";
import { useGiphyService } from "../services/giphyService";
import { GifSelector } from "../components/bucketlist/GifSelector";
import type { BucketListItem, GiphyGif } from "../types";
import { useAuth } from "react-oidc-context";

export const BucketlistEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getById, update } = useBucketlistService();
  const { search } = useGiphyService();
  const auth = useAuth();

  const [item, setItem] = useState<BucketListItem | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedGif, setSelectedGif] = useState<string | null>(null);
  const [gifs, setGifs] = useState<GiphyGif[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isGifLoading, setIsGifLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showGifSelector, setShowGifSelector] = useState(false);

  const currentUserId = useMemo(
    () => auth.user?.profile?.sub,
    [auth.user?.profile?.sub]
  );

  const isOwner = item && currentUserId && item.userId === currentUserId;

  useEffect(() => {
    const loadItem = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        const data = await getById(id);
        setItem(data);
        setTitle(data.title);
        setDescription(data.description ?? "");
        setSelectedGif(data.giphyUrl ?? null);
      } catch (e) {
        setError("Kon item niet laden.");
      } finally {
        setIsLoading(false);
      }
    };
    void loadItem();
  }, [id]);

  const handleSearchGifs = async () => {
    try {
      setIsGifLoading(true);
      setError(null);
      const results = await search(title || item?.title || "");
      setGifs(results);
      setShowGifSelector(true);
    } catch (e) {
      setError("GIFs ophalen mislukt.");
    } finally {
      setIsGifLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!item || !id) return;
    try {
      setIsSaving(true);
      setError(null);
      await update(id, {
        title,
        description: description || null,
        completed: item.completed,
        giphyUrl: selectedGif,
      });
      navigate("/bucketlist");
    } catch (err) {
      setError("Opslaan mislukt.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="h-64 rounded-lg bg-gray-100 animate-pulse" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-6">
        <p className="text-gray-700">Item niet gevonden.</p>
      </div>
    );
  }

  if (!isOwner) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-3">
        <p className="text-gray-700">Geen toegang om dit item te bewerken.</p>
        <button
          onClick={() => navigate("/bucketlist")}
          className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition"
        >
          Terug naar timeline
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Item bewerken</h1>

      {error && (
        <div className="p-3 rounded-md bg-red-100 text-red-700 border border-red-200">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Titel *
            </label>
            <input
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Beschrijving (optioneel)
            </label>
            <textarea
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={description}
              rows={4}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700">Huidige GIF</p>
            <div className="w-full h-72 bg-gray-100 flex items-center justify-center rounded-md overflow-hidden">
              {selectedGif ? (
                <img
                  src={selectedGif}
                  alt={title}
                  className="max-h-72 max-w-full w-auto h-auto object-contain"
                />
              ) : (
                <span className="text-gray-400 text-sm">Geen GIF geselecteerd</span>
              )}
            </div>
          </div>
        </form>

        <div className="space-y-4">
          <p className="text-sm font-medium text-gray-700">Kies een GIF</p>
          <button
            type="button"
            onClick={handleSearchGifs}
            className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition"
            disabled={isGifLoading}
          >
            Zoek GIFs op titel
          </button>

          {showGifSelector && (
            <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
              <GifSelector
                gifs={gifs}
                isLoading={isGifLoading}
                onSelect={(gif) => {
                  setSelectedGif(gif.originalUrl);
                  setShowGifSelector(false);
                }}
                onCancel={() => setShowGifSelector(false)}
              />
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              onClick={handleSubmit}
              className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition"
              disabled={isSaving}
            >
              Opslaan
            </button>
            <button
              type="button"
              onClick={() => navigate("/bucketlist")}
              className="px-4 py-2 rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200 transition"
            >
              Annuleer
            </button>
          </div>

          {isSaving && (
            <div className="flex items-center text-gray-600 gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
              Opslaan...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
