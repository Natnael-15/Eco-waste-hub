import { Link } from 'react-router-dom';
import { FaInstagram, FaTwitter, FaFacebook, FaLeaf } from 'react-icons/fa';

const Footer = () => (
  <footer className="bg-eco-green dark:bg-gray-950 text-white dark:text-eco-yellow py-12 mt-16 border-t border-eco-green/40 dark:border-gray-800 transition-colors duration-300">
    <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
      {/* About Section */}
        <div>
        <div className="flex items-center gap-2 mb-2">
          <FaLeaf className="text-eco-yellow text-2xl" />
          <span className="font-playfair font-bold text-xl">Eco Waste Hub</span>
        </div>
        <p className="text-sm text-white/80 dark:text-eco-yellow/80 mb-4">Your eco-marketplace for surplus food and sustainable groceries. Join us in reducing food waste and supporting communities.</p>
        <div className="flex gap-3 mt-2">
          <Link to="/instagram" aria-label="Instagram" className="hover:text-eco-yellow"><FaInstagram size={22} /></Link>
          <Link to="/twitter" aria-label="Twitter" className="hover:text-eco-yellow"><FaTwitter size={22} /></Link>
          <Link to="/facebook" aria-label="Facebook" className="hover:text-eco-yellow"><FaFacebook size={22} /></Link>
        </div>
      </div>
      {/* Quick Links */}
        <div>
        <h4 className="font-bold mb-3 text-lg">Quick Links</h4>
        <ul className="space-y-2 text-sm">
          <li><Link to="/about" className="hover:underline">About Us</Link></li>
          <li><Link to="/shop" className="hover:underline">Shop</Link></li>
          <li><Link to="/food-deals" className="hover:underline">Food Deals</Link></li>
          <li><Link to="/donate" className="hover:underline">Donate</Link></li>
          <li><Link to="/contact" className="hover:underline">Contact</Link></li>
          </ul>
        </div>
      {/* Info Links */}
        <div>
        <h4 className="font-bold mb-3 text-lg">Info</h4>
        <ul className="space-y-2 text-sm">
          <li><Link to="/faq" className="hover:underline">FAQ</Link></li>
          <li><Link to="/terms" className="hover:underline">Terms of Service</Link></li>
          <li><Link to="/policy" className="hover:underline">Privacy Policy</Link></li>
        </ul>
      </div>
      {/* Contact */}
      <div>
        <h4 className="font-bold mb-3 text-lg">Contact</h4>
        <p className="text-sm mb-2">123 Green Lane, London, UK</p>
        <p className="text-sm mb-2">info@ecowastehub.com</p>
        <p className="text-sm">&copy; {new Date().getFullYear()} Eco Waste Hub. All rights reserved.</p>
      </div>
      </div>
    </footer>
  );

export default Footer; 