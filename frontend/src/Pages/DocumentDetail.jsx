import React, { useEffect, useState, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
import pdfimage from "../assets/pdfimage.png";
import {
  Heart,
  Star,
  StarHalf,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { toast } from "sonner";

export default function DocDetail() {
  const { id } = useParams();
  const location = useLocation();
  const [doc, setDoc] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { user, toggleWishlist, toggleCart } = useAuth();
  const navigate=useNavigate()
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const swiperRef = useRef(null);

  const passedRating = location.state?.rating;
  const passedCount = location.state?.ratingCount;

  useEffect(() => {
    async function fetchDoc() {
      const res = await api.get(`/api/v1/doc/${id}`);
      setDoc(res.data);
      setSelectedImage(res.data.thumbnailURL || pdfimage);
    }
    fetchDoc();
  }, [id]);

  if (!doc) return <p className="text-center mt-20">Loading...</p>;

  const rating = passedRating || doc.rating || 4.8;
  const ratingCount = passedCount || doc.ratingCount || 120;

  const galleryImages = [
    doc.thumbnailURL || pdfimage,
    ...(doc.extraImageURLs || []),
  ];

  return (
    <div className="md:max-w-6xl sm:mx-auto mt-6 sm:mt-10 p-4 sm:p-6 bg-white rounded-xl shadow-lg font-poppins relative">
      {/* 🖼️ Fullscreen Modal */}
   {isFullscreen && (
  <div
    className="fixed inset-0 bg-gray-100 bg-opacity-90 flex flex-col items-center justify-center z-50"
    onClick={() => setIsFullscreen(false)}
  >
    <button
      className="absolute top-5 right-5 text-black hover:text-gray-300 z-50"
      onClick={(e) => {
        e.stopPropagation();
        setIsFullscreen(false);
      }}
    >
      <X size={28} />
    </button>

    {/* ✅ Use separate ref for fullscreen swiper */}
    <div
      className="relative w-full max-w-5xl"
      onClick={(e) => e.stopPropagation()}
    >
     {/* Fullscreen Swiper — use custom arrows only */}
<Swiper
  modules={[Navigation]}
  spaceBetween={20}
  slidesPerView={1}
  loop={true}
  navigation={false}         // ← disable built-in buttons
  initialSlide={Math.max(0, galleryImages.indexOf(selectedImage))}
  className="rounded-md"
  onSwiper={(swiper) => { swiperRef.current = swiper; }}
  onSlideChange={(swiper) => {
    const current = galleryImages[swiper.realIndex % galleryImages.length];
    setSelectedImage(current);
  }}
>
  {galleryImages.map((url, i) => (
    <SwiperSlide key={i}>
      <img
        src={url}
        alt={`Fullscreen ${i}`}
        className="w-full max-h-[85vh] object-contain rounded-lg"
      />
    </SwiperSlide>
  ))}
</Swiper>

{/* custom chevrons (unchanged) */}
<ChevronLeft
  size={36}
  className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-black/40 hover:bg-black/60 rounded-full p-2 cursor-pointer z-50"
  onClick={(e) => { e.stopPropagation(); swiperRef.current?.slidePrev(); }}
/>
<ChevronRight
  size={36}
  className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-black/40 hover:bg-black/60 rounded-full p-2 cursor-pointer z-50"
  onClick={(e) => { e.stopPropagation(); swiperRef.current?.slideNext(); }}
/>


      {/* ⬅️➡️ Custom arrows now control fullscreen swiper */}
      <ChevronLeft
        size={36}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-black/40 hover:bg-black/60 rounded-full p-2 cursor-pointer z-50"
        onClick={(e) => {
          e.stopPropagation();
          swiperRef.current?.slidePrev();
        }}
      />
      <ChevronRight
        size={36}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-black/40 hover:bg-black/60 rounded-full p-2 cursor-pointer z-50"
        onClick={(e) => {
          e.stopPropagation();
          swiperRef.current?.slideNext();
        }}
      />
    </div>

    {/* 📸 Thumbnails below fullscreen Swiper */}
    <div
      className="flex gap-3 mt-4 overflow-x-auto scrollbar-hide w-full max-w-5xl justify-center"
      onClick={(e) => e.stopPropagation()}
    >
      {galleryImages.map((url, index) => (
        <img
          key={index}
          src={url}
          alt={`Thumb ${index + 1}`}
          onClick={() => {
            setSelectedImage(url);
            swiperRef.current?.slideToLoop(index); // ✅ works now!
          }}
          className={`w-20 h-20 object-cover rounded-md border-2 cursor-pointer transition 
            ${
              selectedImage === url
                ? "border-blue-500 scale-105"
                : "border-gray-300 hover:border-blue-400"
            }`}
        />
      ))}
    </div>
  </div>
)}



      <div className="flex flex-col md:flex-row md:gap-10 md:items-start">
        {/* 🖼️ Image Section */}
        <div className="md:w-1/2 flex flex-col items-center relative">
          <div className="relative w-full">
            <Swiper
              modules={[Navigation]}
              spaceBetween={10}
              slidesPerView={1}
              loop={true} // ✅ Enable looping
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
              onSlideChange={(swiper) => {
                const current =
                  galleryImages[
                    swiper.realIndex % galleryImages.length
                  ];
                setSelectedImage(current);
              }}
              navigation={{
                prevEl: prevRef.current,
                nextEl: nextRef.current,
              }}
              onBeforeInit={(swiper) => {
                swiper.params.navigation.prevEl = prevRef.current;
                swiper.params.navigation.nextEl = nextRef.current;
              }}
              className="rounded-md"
            >
              {galleryImages.map((url, i) => (
                <SwiperSlide key={i}>
                  <img
                    src={url}
                    alt={`Slide ${i}`}
                    className="w-full h-96 sm:h-96 object-contain rounded-md cursor-zoom-in transition-transform duration-300 hover:scale-105"
                    onClick={() => {
                      setSelectedImage(url);
                      setIsFullscreen(true);
                    }}
                  />
                </SwiperSlide>
              ))}
            </Swiper>

            {/* ⬅️➡️ Arrow Buttons */}
            <button
              ref={prevRef}
              onClick={(e) => e.stopPropagation()}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-md z-20"
              aria-label="Previous image"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              ref={nextRef}
              onClick={(e) => e.stopPropagation()}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-md z-20"
              aria-label="Next image"
            >
              <ChevronRight size={22} />
            </button>

            {doc.discountPercent && (
              <span className="absolute top-3 right-3 bg-orange-500 text-white text-sm sm:text-base font-semibold px-3 py-1 rounded-full shadow-md z-30">
                -{doc.discountPercent}%
              </span>
            )}
          </div>

          {/* 📸 Thumbnail Gallery */}
          <div className="flex gap-3 mt-4 overflow-x-auto scrollbar-hide w-full justify-center p-2">
            {galleryImages.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Preview ${index + 1}`}
                onClick={() => {
                  setSelectedImage(url);
                  swiperRef.current?.slideToLoop(index); // ✅ jump to looped slide
                }}
                className={`w-20 h-20 object-cover rounded-md border-2 cursor-pointer transition 
                  ${
                    selectedImage === url
                      ? "border-blue-500 scale-105"
                      : "border-gray-300 hover:border-blue-400"
                  }`}
              />
            ))}
          </div>
        </div>

        {/* 📄 Details Section */}
        <div className="md:w-1/2 mt-6 md:mt-0">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            {doc.title}
          </h1>

          {/* ⭐ Rating */}
          <div className="flex items-center mt-1 mb-3 gap-[2px]">
            {Array.from({ length: 5 }).map((_, i) => {
              if (i < Math.floor(rating))
                return <Star key={i} fill="#FDBC00" stroke="#FDBC00" height={18} />;
              if (i === Math.floor(rating) && rating % 1 >= 0.5)
                return <StarHalf key={i} fill="#FDBC00" stroke="#FDBC00" height={18} />;
              return <Star key={i} stroke="#FDBC00" height={18} />;
            })}
            <span className="ml-2 text-sm text-gray-700">
              ({ratingCount} reviews)
            </span>
          </div>

          {/* 💰 Price + Wishlist */}
          <div className="flex items-center space-x-3 mt-3">
            <div>
              <span className="text-gray-400 line-through text-sm mr-1">
                ₹{doc.price}
              </span>
              <span className="text-red-600 font-semibold text-xl">
                ₹{doc.finalPrice}
              </span>
            </div>

            {/* ❤️ Wishlist */}
            <button
              className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100 transition"
              aria-label="Add to Wishlist"
              onClick={(e) => {
                e.stopPropagation();
                toggleWishlist(doc._id);
              }}
            >
              <Heart
                size={18}
                fill={user?.wishlist?.includes(doc._id) ? "#ff4d6d" : "none"}
                stroke="#ff4d6d"
              />
            </button>
          </div>

          {/* 🛒 Cart */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-5">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full text-sm sm:text-base shadow-md transition"
              onClick={(e) => {
                e.stopPropagation();
                toggleCart(doc._id);
              }}
            >
              {user?.cart?.includes(doc._id)
                ? "Remove from Cart"
                : "Add to Cart"}
            </button>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full text-sm sm:text-base shadow-md transition"
              onClick={(e) => {
                if (!user) {
      toast.info("Please login to buy documents.");
      return;
    }

                e.stopPropagation();

                if(user?.cart?.includes(doc._id)){
                  navigate('/cart')
                  return;
                }
                else{
 toggleCart(doc._id);
                navigate('/cart')
                }
               
              }}
            >
             Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
