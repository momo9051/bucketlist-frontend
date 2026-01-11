import { useRef } from "react";
import type { BucketListItem } from "../../types";
import { formatLocalDate } from "../../utils/date";

type ItemDetailModalProps = {
  item: BucketListItem | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  isOwner: boolean;
  onMarkComplete?: () => Promise<void> | void;
  onUploadProof?: (file: File) => Promise<void> | void;
  isUpdatingStatus?: boolean;
  isUploadingProof?: boolean;
};

export const ItemDetailModal = ({
  item,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  isOwner,
  onMarkComplete,
  onUploadProof,
  isUpdatingStatus = false,
  isUploadingProof = false,
}: ItemDetailModalProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen || !item) return null;

  const showSideBySide = item.completed && !!item.photoUrl;
  const canChangePhoto = item.completed && !!item.photoUrl && !!onUploadProof;
  const canUploadProof = item.completed && !item.photoUrl && !!onUploadProof;

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUploadProof) {
      void onUploadProof(file);
      e.target.value = "";
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-3xl rounded-lg shadow-xl overflow-hidden">
        <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200">
          <div>
            <p className="text-sm text-gray-600">{item.username || item.userId}</p>
            <h2 className="text-xl font-semibold text-gray-900">{item.title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="p-4 space-y-4">
          {showSideBySide ? (
            <div className="flex flex-col md:flex-row gap-4">
              <div className="bg-gray-100 rounded-md overflow-hidden flex-1 flex items-center justify-center aspect-square">
                {item.giphyUrl ? (
                  <img
                    src={item.giphyUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400 text-sm p-6">Geen afbeelding</span>
                )}
              </div>
              <div className="bg-gray-100 rounded-md overflow-hidden flex-1 flex items-center justify-center aspect-square">
                {item.photoUrl ? (
                  <img
                    src={item.photoUrl}
                    alt="Bewijsfoto"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400 text-sm p-6">Geen foto</span>
                )}
              </div>
            </div>
          ) : (
            <div className="w-full bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
              <div className="max-h-[70vh] max-w-full w-full flex items-center justify-center p-2">
                {item.giphyUrl ? (
                  <img
                    src={item.giphyUrl}
                    alt={item.title}
                    className="max-h-[70vh] max-w-full w-auto h-auto object-contain"
                  />
                ) : (
                  <span className="text-gray-400 text-sm p-6">Geen afbeelding</span>
                )}
              </div>
            </div>
          )}

          <p className="text-gray-700 whitespace-pre-wrap">
            {item.description ?? "Geen beschrijving"}
          </p>

          <p className="text-xs text-gray-500">
            Aangemaakt op {formatLocalDate(item.createdAt)}
          </p>

          {isOwner && (
            <div className="flex flex-wrap gap-3">
              {onMarkComplete && !item.completed && (
                <button
                  onClick={() => onMarkComplete()}
                  className="px-4 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 transition disabled:opacity-60"
                  disabled={isUpdatingStatus}
                >
                  {isUpdatingStatus ? "Bezig..." : "Markeer als voltooid"}
                </button>
              )}

              {canUploadProof && (
                <>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <button
                    type="button"
                    onClick={handleUploadClick}
                    className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition disabled:opacity-60"
                    disabled={isUploadingProof}
                  >
                    {isUploadingProof ? "Uploaden..." : "Bewijsfoto uploaden"}
                  </button>
                </>
              )}

              {canChangePhoto && (
                <>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                    <button
                      type="button"
                      onClick={handleUploadClick}
                      className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition disabled:opacity-60"
                      disabled={isUploadingProof}
                    >
                      {isUploadingProof ? "Uploaden..." : "Bewijsfoto wijzigen"}
                    </button>
                </>
              )}

              {onEdit && (
                <button
                  onClick={onEdit}
                  className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition"
                >
                  Bewerken
                </button>
              )}
              {onDelete && (
                <button
                  onClick={onDelete}
                  className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
                >
                  Verwijderen
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
