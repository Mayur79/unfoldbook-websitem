import { Star } from "lucide-react";

const StarRating = ({ rating = 0 }) => {
  const safeRating = Number(rating) || 0;
  const filledStars = Math.floor(safeRating);
  const hasHalfStar = safeRating - filledStars >= 0.5;
  const totalStars = 5;

  return (
    <div className="flex items-center text-yellow-400 mt-1">
      {Array.from({ length: totalStars }).map((_, i) => {
        if (i < filledStars) {
          // Full star
          return <Star key={i} fill="#FDBC00" height={18} stroke="#FDBC00" />;
        } else if (i === filledStars && hasHalfStar) {
          // Half-filled star using gradient
          return (
            <div key={i} className="relative w-[18px] h-[18px]">
              <Star fill="none" height={18} stroke="#FDBC00" className="absolute top-0 left-0" />
              <Star fill="url(#halfGradient)" height={18} stroke="#FDBC00" className="absolute top-0 left-0" />
              <svg width="0" height="0">
                <defs>
                  <linearGradient id="halfGradient">
                    <stop offset="50%" stopColor="#FDBC00" />
                    <stop offset="50%" stopColor="white" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          );
        } else {
          // Empty star
          return <Star key={i} height={18} stroke="#FDBC00" />;
        }
      })}

      <span className="ml-1 text-black">({safeRating.toFixed(1)})</span>
    </div>
  );
};

export default StarRating;
