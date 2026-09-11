import { Pill, Phone, Mail, MapPin, Shield, FileText } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 text-white font-bold text-xl mb-3">
              <Pill className="w-5 h-5 text-blue-400" />
              MediCare <span className="text-green-400">Plus</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Your trusted neighbourhood pharmacy online. 100% genuine medicines, delivered directly to your doorstep.
            </p>
            <div className="inline-flex items-center gap-2 text-xs bg-gray-800 text-green-400 px-3 py-1.5 rounded-full border border-gray-700">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" /> Verified Digital Pharmacy
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-3 text-sm tracking-wider uppercase">Shop & Browse</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/medicines" className="hover:text-white transition-colors">Browse Medicines</Link></li>
              <li><Link to="/wishlist" className="hover:text-white transition-colors">Wishlist</Link></li>
              <li><Link to="/cart" className="hover:text-white transition-colors">My Cart</Link></li>
              <li><Link to="/orders" className="hover:text-white transition-colors">My Orders</Link></li>
            </ul>
          </div>

          {/* Legal & Policy */}
          <div>
            <h3 className="text-white font-semibold mb-3 text-sm tracking-wider uppercase">Legal & Compliance</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-blue-400" /> Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-indigo-400" /> Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="text-white font-semibold mb-3 text-sm tracking-wider uppercase">Contact Us</h3>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-2 text-gray-400"><Phone className="w-4 h-4 text-blue-400" /> +91 98765 43210</li>
              <li className="flex items-center gap-2 text-gray-400"><Mail className="w-4 h-4 text-blue-400" /> support@medicareplus.example.com</li>
              <li className="flex items-center gap-2 text-gray-400"><MapPin className="w-4 h-4 text-blue-400" /> Amaravati, Andhra Pradesh</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} MediCare Plus. All rights reserved. | Built for VTAPP Hackathon 2026</p>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:text-gray-400 transition-colors">Privacy</Link>
            <span>•</span>
            <Link to="/terms" className="hover:text-gray-400 transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
