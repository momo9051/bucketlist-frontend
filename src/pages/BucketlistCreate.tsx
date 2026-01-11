import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useBucketlistService } from "../services/bucketlistService";
import { useGiphyService } from "../services/giphyService";
import { GifSelector } from "../components/bucketlist/GifSelector";
import type { GiphyGif } from "../types";

export const BucketlistCreate = () => {
  const { create } = useBucketlistService();
  const { search } = useGiphyService();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [gifs, setGifs] = useState<GiphyGif[]>([]);
  const [isLoadingGifs, setIsLoadingGifs] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [error, setError] = useState<string | null>(null);

  const handleSearchGifs = async () => {
    try {
      setIsLoadingGifs(true);
      setError(null);
      const results = await search(title);
      setGifs(results);
      setStep(2);
    } catch (e) {
      setError("Zoeken naar GIFs mislukt.");
    } finally {
      setIsLoadingGifs(false);
    }
  };

  const handleSelectGif = async (gif: GiphyGif) => {
    try {
      setIsSubmitting(true);
      setError(null);
      await create({
        title,
        description: description || null,
        giphyUrl: gif.originalUrl,
      });
      navigate("/bucketlist");
    } catch (e) {
      setError("Aanmaken van item is mislukt.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitStep1 = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Titel is verplicht.");
      return;
    }
    await handleSearchGifs();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Nieuw bucketlist item</h1>

      {error && (
        <div className="p-3 rounded-md bg-red-100 text-red-700 border border-red-200">
          {error}
        </div>
      )}

      {step === 1 && (
        <form className="space-y-4" onSubmit={handleSubmitStep1}>
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

          <div className="flex gap-3">
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition"
              disabled={isLoadingGifs}
            >
              Volgende (GIF kiezen)
            </button>
            <button
              type="button"
              onClick={() => navigate("/bucketlist")}
              className="px-4 py-2 rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200 transition"
            >
              Annuleer
            </button>
          </div>
        </form>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Kies een GIF</h2>
            <button
              onClick={() => setStep(1)}
              className="text-sm text-indigo-600 hover:underline"
            >
              Titel aanpassen
            </button>
          </div>

          <GifSelector
            gifs={gifs}
            isLoading={isLoadingGifs}
            onSelect={handleSelectGif}
            onCancel={() => setStep(1)}
          />

          {isSubmitting && (
            <div className="flex items-center text-gray-600 gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
              Opslaan...
            </div>
          )}
        </div>
      )}
    </div>
  );
};
