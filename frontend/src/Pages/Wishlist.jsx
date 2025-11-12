import { useEffect, useState, useMemo } from "react"
import { useAuth } from "../context/AuthContext"
import api from "../services/api"
import pdfimage from "../assets/pdfimage.png"
import { Heart, ShoppingCart, Trash2, ArrowRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import MobileSearchBar from "../Component/MobileSearchBar"
import { useSearch } from "../context/SearchContext"


export default function WishlistPage() {
  const { user, toggleWishlist, toggleCart } = useAuth()
  const [wishlistDocs, setWishlistDocs] = useState([])
  const { searchQuery } = useSearch();
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchWishlist() {
      if (!user?._id) return
      try {
        const res = await api.get(`/api/users/getUserWishlist`)
        setWishlistDocs(res.data.wishlist || [])
      } catch (err) {
        console.error(err)
        toast.error("Failed to load wishlist.")
      }
    }
    fetchWishlist()
  }, [user])

  // ✅ Filter wishlist based on search query
  const filteredDocs = useMemo(() => {
    return wishlistDocs.filter(
      (doc) =>
        doc.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc._id?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [wishlistDocs, searchQuery])

  if (!user)
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white flex items-center justify-center p-4">
        <div className="text-center">
          <Heart className="w-16 h-16 text-pink-300 mx-auto mb-4" />
          <p className="text-lg text-gray-600">Please login to view your wishlist.</p>
        </div>
      </div>
    )

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-pink-50 font-poppins">
      {/* ✅ Mobile Search Bar */}
      <MobileSearchBar
      />

      <div className="max-w-6xl mx-auto p-4 sm:p-8">
        <div className="mb-12 mt-4 sm:mt-0">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 flex items-center gap-3 mb-2">
            <Heart className="w-10 h-10 text-pink-600" />
            Your Wishlist
          </h1>
          <div className="h-1 w-20 bg-gradient-to-r from-pink-600 to-pink-400 rounded-full"></div>
          <p className="text-gray-600 mt-3">
            {filteredDocs.length} {filteredDocs.length === 1 ? "item" : "items"} found
          </p>
        </div>

        {filteredDocs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl border border-pink-100 p-12 sm:p-16 text-center shadow-sm"
          >
            <Heart className="w-20 h-20 text-pink-200 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              {searchQuery ? "No results found" : "Your wishlist is empty"}
            </h2>
            <p className="text-gray-500 mb-8">
              {searchQuery
                ? "Try a different search term."
                : "Add documents to your wishlist to save them for later!"}
            </p>
            {!searchQuery && (
              <button
                onClick={() => navigate("/")}
                className="inline-flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-8 py-3 rounded-full font-semibold transition-all shadow-md hover:shadow-lg"
              >
                Browse Documents
                <ArrowRight size={18} />
              </button>
            )}
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {filteredDocs.map((doc, index) => (
                <motion.div
                  key={doc._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-2xl p-6 border border-pink-100 hover:border-pink-300 hover:shadow-md transition-all group"
                >
                  <div className="relative w-full h-56 rounded-xl overflow-hidden flex items-center justify-center mb-4">
                    <img
                      src={doc.thumbnailBase64 || pdfimage}
                      alt={doc.title}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => toggleWishlist(doc._id)}
                      title="Remove from wishlist"
                      className="absolute top-3 right-3 p-2 bg-white/80 rounded-full hover:bg-pink-100 text-pink-600 transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <h3 className="font-semibold text-lg text-gray-900 truncate group-hover:text-pink-600 transition">
                    {doc.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">ID: {doc._id.slice(-8)}</p>

                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-2xl font-bold text-pink-600">₹{doc.finalPrice}</span>
                    <button
                      disabled={loading}
                      onClick={() => toggleCart(doc._id)}
                      className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-all shadow hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ShoppingCart size={16} />
                      {user?.cart?.includes(doc._id)
                        ? "Already in Cart"
                        : "Add to Cart"}
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}
