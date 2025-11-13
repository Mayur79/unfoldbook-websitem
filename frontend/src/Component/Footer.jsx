import { useState } from "react";
import { Mail, MapPin, Phone, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa";
import logo from "../assets/logo.png";
import TermsModal from "./TermModal";
import RefundModal from "./RefundModal";
import PrivacyModal from "./PrivacyModal";

export default function Footer() {
  const [openSection, setOpenSection] = useState(null);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

const [isRefundOpen, setIsRefundOpen] = useState(false);
  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };
    const [isTermsOpen, setIsTermsOpen] = useState(false);
  return (
    <>
    <TermsModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
      <RefundModal isOpen={isRefundOpen} onClose={() => setIsRefundOpen(false)} />
        <PrivacyModal isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} />
    <footer className="bg-blue-100 text-black font-poppins">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Contact / Address Section */}
        <div>
          <img src={logo} alt="UnofldBook Logo" className="h-10 mb-4" />
          <h3 className="text-sm font-light mb-4">Publication Inc</h3>
          <ul className="space-y-3 text-black text-sm">
            <li className="flex items-start gap-2">
              <MapPin size={18} className="mt-0.5" />
              Near Manshal Bhagat house, Gondia
            </li>
            <li className="flex items-center gap-2">
              <Mail size={18} /> info@unfoldb.com
            </li>
            <li className="flex items-center gap-2">
              <Phone size={18} /> 011-49842349 / 50
            </li>
            <li className="flex items-start gap-2">
              <Clock size={18} className="mt-0.5" />
              Working Hours: 09:30 AM – 06:00 PM (Mon–Sat, 2nd & 4th Sat Off)
            </li>
          </ul>
        </div>

        {/* Support Section */}
        <div>
          <button
            onClick={() => toggleSection("support")}
            className="flex w-full justify-between items-center lg:cursor-default lg:pointer-events-none"
          >
            <h3 className="text-lg font-semibold mb-4 lg:mb-0">Support</h3>
            <span className="lg:hidden">
              {openSection === "support" ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </span>
          </button>

          <ul
            className={`overflow-hidden transition-all duration-300 text-black text-sm space-y-2 ${
              openSection === "support" ? "max-h-60 mt-2" : "max-h-0 lg:max-h-none lg:mt-4"
            }`}
          >
            <li>About Us</li>
            <li>Exam Updates</li>
            <li>Request for Specimen</li>
            <li>Connect With Us</li>
            <li>Team</li>
            <li>Work with Us</li>
            <li>Track Your Order</li>
            <li>Media Coverage</li>
          </ul>
        </div>

        {/* My Account Section */}
        <div>
          <button
            onClick={() => toggleSection("account")}
            className="flex w-full justify-between items-center lg:cursor-default lg:pointer-events-none"
          >
            <h3 className="text-lg font-semibold mb-4 lg:mb-0">My Account</h3>
            <span className="lg:hidden">
              {openSection === "account" ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </span>
          </button>

          <ul
            className={`overflow-hidden transition-all duration-300 text-black text-sm space-y-2 ${
              openSection === "account" ? "max-h-60 mt-2" : "max-h-0 lg:max-h-none lg:mt-4"
            }`}
          >
            <li>Sign In</li>
            <li>View Cart</li>
            <li>Contact Us</li>
            <li>FAQs</li>
            <li>Catalogue</li>
            <li   onClick={() => setIsRefundOpen(true)} className="cursor-pointer">Refund Policy</li>
            <li onClick={() => setIsTermsOpen(true)} className="cursor-pointer">Terms of Service</li>
            <li   onClick={() => setIsPrivacyOpen(true)} className="cursor-pointer"
>Privacy Policy</li>
          </ul>
        </div>

        {/* Newsletter Section */}
        <div>
          <button
            onClick={() => toggleSection("newsletter")}
            className="flex w-full justify-between items-center lg:cursor-default lg:pointer-events-none"
          >
            <h3 className="text-lg font-semibold mb-3 lg:mb-0">
              India’s First Newsletter For Students – ACE Your Life
            </h3>
            <span className="lg:hidden">
              {openSection === "newsletter" ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </span>
          </button>

          <div
            className={`overflow-hidden transition-all duration-300 ${
              openSection === "newsletter" ? "max-h-[500px] mt-2" : "max-h-0 lg:max-h-none lg:mt-3"
            }`}
          >
            <p className="text-black text-sm mb-4">
              Subscribe to our weekly student newsletter for inspirational stories and get 10% off your first purchase.
            </p>

            <div className="flex mb-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-3 py-2 rounded-l-md bg-transparent border border-gray-500 focus:outline-none text-sm text-black"
              />
              <button className="bg-blue-600 px-4 rounded-r-md text-sm font-semibold">
                Subscribe
              </button>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <a href="#" className="hover:text-[#E61E5C]"><FaFacebookF /></a>
              <a href="#" className="hover:text-[#E61E5C]"><FaInstagram /></a>
              <a href="#" className="hover:text-[#E61E5C]"><FaLinkedinIn /></a>
              <a href="#" className="hover:text-[#E61E5C]"><FaYoutube /></a>
            </div>

          
          </div>
        </div>
      </div>

      {/* Footer Bottom Bar */}
      <div className="bg-blue-600 text-white text-center text-sm py-3 mb-16 md:mb-0">
        Copyright © {new Date().getFullYear()} UnFoldBoook Publication. All rights reserved.
      </div>
    </footer>
    </>
  );
}
