export const Footer = () => {
  return (
    <footer className="w-full bg-white border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-6 py-4 text-sm text-gray-500">
        © {new Date().getFullYear()} Bucket List
      </div>
    </footer>
  );
};
