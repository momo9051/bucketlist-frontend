import type { GiphyGif } from "../../types";

type GifSelectorProps = {
  gifs: GiphyGif[];
  isLoading?: boolean;
  onSelect: (gif: GiphyGif) => void;
  onCancel?: () => void;
};

export const GifSelector = ({
  gifs,
  isLoading = false,
  onSelect,
  onCancel,
}: GifSelectorProps) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mb-3"></div>
        <p className="text-gray-600">GIFs laden...</p>
      </div>
    );
  }

  if (!gifs.length) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-gray-600">
        Geen GIFs gevonden.
        {onCancel && (
          <button
            onClick={onCancel}
            className="mt-3 px-4 py-2 rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200 transition"
          >
            Terug
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {gifs.map((gif) => (
          <button
            key={gif.id}
            type="button"
            onClick={() => onSelect(gif)}
            className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <img
              src={gif.previewUrl}
              alt={gif.title ?? "GIF"}
              className="w-full h-56 object-contain bg-black/5"
            />
          </button>
        ))}
      </div>
      {onCancel && (
        <div className="flex justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200 transition"
          >
            Annuleer
          </button>
        </div>
      )}
    </div>
  );
};
