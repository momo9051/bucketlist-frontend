import type { BucketListItem } from "../../types";

type ItemCardProps = {
  item: BucketListItem;
  onClick: () => void;
};

export const ItemCard = ({ item, onClick }: ItemCardProps) => {
  const isCompleted = item.completed === true;
  const cardBg = isCompleted
    ? "bg-emerald-100 border-emerald-200/80"
    : "bg-white border-gray-200/80";

  return (
    <button
      type="button"
      onClick={onClick}
      style={{ breakInside: "avoid" }}
      className={`group relative w-full text-left rounded-xl border shadow-sm hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 ${cardBg}`}
    >
      <div className="px-4 pt-3 pb-2 flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-gray-500">
          {item.username || item.userId || "Onbekende gebruiker"}
        </p>
        {isCompleted && (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold text-emerald-700 bg-emerald-100 border border-emerald-200 rounded-full">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden />
            Voltooid
          </span>
        )}
      </div>
      <div className="w-full bg-gray-50 overflow-hidden">
        {item.giphyUrl ? (
          <img
            src={item.giphyUrl}
            alt={item.title}
            className="w-full h-auto object-cover transition-transform duration-200 group-hover:scale-[1.01]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            Geen afbeelding
          </div>
        )}
      </div>
      <div className="px-4 py-3">
        <p className="text-lg font-semibold text-gray-900 leading-tight line-clamp-2">
          {item.title}
        </p>
      </div>
    </button>
  );
};
