import type { BucketListItem } from "../../types";

type ItemCardProps = {
  item: BucketListItem;
  onClick: () => void;
};

export const ItemCard = ({ item, onClick }: ItemCardProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{ breakInside: "avoid" }}
      className="w-full text-left bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
    >
      <div className="px-3 py-2 bg-gray-50 text-sm font-semibold text-gray-700">
        {item.username || item.userId}
      </div>
      <div className="w-full bg-gray-100">
        {item.giphyUrl ? (
          <img
            src={item.giphyUrl}
            alt={item.title}
            className="w-full h-auto object-contain"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            Geen afbeelding
          </div>
        )}
      </div>
      <div className="px-3 py-2">
        <p className="font-semibold text-gray-900 line-clamp-1">{item.title}</p>
      </div>
    </button>
  );
};
