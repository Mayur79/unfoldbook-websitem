import { useEffect, useState, useMemo } from "react"
import { useAuth } from "../context/AuthContext"
import api from "../services/api"
import pdfimage from "../assets/pdfimage.png"
import { Trash2, CreditCard, ShoppingCart, ArrowRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import MobileSearchBar from "../Component/MobileSearchBar" // ✅ import added

export default function CartPage() {
  const { user, toggleCart } = useAuth()
  const [cartDocs, setCartDocs] = useState([])
  const [searchQuery, setSearchQuery] = useState("") // ✅ search query state
  const [totalPrice, setTotalPrice] = useState(0)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchCart() {
      if (!user?._id) return
      const res = await api.get(`/api/users/getUserCart`)
      setCartDocs(res.data.cart)
      const total = res.data.cart.reduce((sum, doc) => sum + (doc.finalPrice || 0), 0)
      setTotalPrice(total)
    }

    fetchCart()
  }, [user])

  // ✅ Filter cart items based on search query
  const filteredCart = useMemo(() => {
    return cartDocs.filter(
      (doc) =>
        doc.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc._id?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [cartDocs, searchQuery])

  // 🧾 Razorpay payment handler
  const handlePayment = async () => {
    try {
      setLoading(true)
      const res = await api.post("/api/v1/pay/create-order", {
        userId: user._id,
        amount: totalPrice,
        documentIds: cartDocs.map((d) => d._id),
      })

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: res.data.amount,
        currency: "INR",
        name: "UnfoldBook",
        order_id: res.data.orderId,
        handler: async (response) => {
          try {
            await api.post("/api/v1/pay/verify-payment", {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            })
            toast.success("Payment Successful!")
            navigate("/purchased")
          } catch {
            toast.error("Payment verification failed!")
          }
        },
        theme: { color: "#0066FF" },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (error) {
      console.log(error)
      toast.error("Payment failed! Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (!user)
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
        <div className="text-center">
          <ShoppingCart className="w-16 h-16 text-blue-300 mx-auto mb-4" />
          <p className="text-lg text-gray-600">Please login to view your cart.</p>
        </div>
      </div>
    )

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50 font-poppins">
      {/* ✅ Mobile Search Bar */}
      <MobileSearchBar
        placeholder="Search cart..."
        onSearch={(query) => setSearchQuery(query)}
      />

      <div className="max-w-6xl mx-auto p-4 sm:p-8">
        <div className="mb-12 mt-4 sm:mt-0">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 flex items-center gap-3 mb-2">
            <ShoppingCart className="w-10 h-10 text-blue-600" />
            Your Cart
          </h1>
          <div className="h-1 w-20 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full"></div>
          <p className="text-gray-600 mt-3">
            {filteredCart.length} {filteredCart.length === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        {filteredCart.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl border border-blue-100 p-12 sm:p-16 text-center shadow-sm"
          >
            <ShoppingCart className="w-20 h-20 text-blue-200 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              {searchQuery ? "No results found" : "Your cart is empty"}
            </h2>
            <p className="text-gray-500 mb-8">
              {searchQuery
                ? "Try a different search term."
                : "Start adding documents to your cart to get started"}
            </p>
            {!searchQuery && (
              <button
                onClick={() => navigate("/")}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold transition-all shadow-md hover:shadow-lg"
              >
                Continue Shopping
                <ArrowRight size={18} />
              </button>
            )}
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="space-y-3">
                <AnimatePresence>
                  {filteredCart.map((doc, index) => (
                    <motion.div
                      key={doc._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white rounded-2xl p-5 sm:p-6 border border-blue-100 hover:border-blue-300 hover:shadow-md transition-all group"
                    >
                      <div className="flex flex-wrap sm:flex-nowrap items-start gap-4">
                        <div className="flex-shrink-0">
                          <div className="relative w-24 h-32 rounded-xl overflow-hidden flex items-center justify-center">
                            <img
                              src={doc.thumbnailBase64 || pdfimage}
                              alt={doc.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>

                        <div className="flex-grow min-w-0">
                          <h2 className="font-semibold text-lg text-gray-900 truncate group-hover:text-blue-600 transition">
                            {doc.title}
                          </h2>
                          <p className="text-sm text-gray-500 mt-2">
                            Document ID: {doc._id.slice(-8)}
                          </p>

                          <div className="mt-4 flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-blue-600">
                              ₹{doc.finalPrice}
                            </span>
                            <span className="text-sm text-gray-400">INR</span>
                          </div>
                        </div>

                        <button
                          onClick={() => toggleCart(doc._id)}
                          className="flex-shrink-0 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          title="Remove from cart"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* 🧾 Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="sticky top-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-8 text-white shadow-xl"
              >
                <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                  <CreditCard size={20} />
                  Order Summary
                </h3>

                <div className="space-y-4 mb-6 pb-6 border-b border-blue-500 border-opacity-30">
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-100">Subtotal</span>
                    <span className="font-medium">₹{totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-100">Shipping</span>
                    <span className="font-medium text-green-300">Free</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-100">Tax</span>
                    <span className="font-medium">₹0.00</span>
                  </div>
                </div>

                <div className="mb-8">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-blue-100 text-sm">Total Amount</span>
                    <span className="text-3xl font-bold">₹{totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handlePayment}
                  disabled={loading || totalPrice === 0}
                  className="w-full bg-white hover:bg-blue-50 text-blue-600 font-semibold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                >
                  <CreditCard size={20} className="group-hover:scale-110 transition-transform" />
                  {loading ? "Processing..." : "Proceed to Payment"}
                </button>

                <p className="text-xs text-blue-100 text-center mt-4">
                  ✓ Secure payment powered by Razorpay
                </p>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
