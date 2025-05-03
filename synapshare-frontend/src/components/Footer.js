import { FiGithub, FiGlobe, FiArrowUp } from "react-icons/fi";
import { motion } from "framer-motion"; // For animations

function Footer() {
  // Function to scroll back to the top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-gray-100 dark:bg-gray-900 border-t border-gray-200/30 dark:border-gray-800/30 py-8 z-20">
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950 dark:via-indigo-950 dark:to-purple-950 opacity-20"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center justify-between gap-6 text-gray-700 dark:text-gray-300"
        >
          {/* Left Section: Branding & Tagline */}
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <span className="text-lg font-semibold text-gray-900 dark:text-white tracking-tight">
              SynapShare
            </span>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mt-1">
              Connect, Learn, and Share Knowledge
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
              © 2025 SynapShare. Made by Kamlesh Porwal
            </p>
          </div>

          {/* Right Section: Links & Back to Top */}
          <div className="flex flex-col items-center sm:items-end gap-4">
            {/* Social Links & Navigation */}
            <div className="flex gap-3">
              <motion.a
                href="https://www.linkedin.com/in/kamlesh-porwal-2b1a2a1a6/"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-blue-600 dark:to-indigo-600 text-white rounded-full hover:from-blue-600 hover:to-indigo-600 dark:hover:from-blue-700 dark:hover:to-indigo-700 transition-all duration-300 shadow-md"
                aria-label="LinkedIn Profile"
              >
                <FiGlobe size={18} />
              </motion.a>
              <motion.a
                href="https://github.com/kamleshp214"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-blue-600 dark:to-indigo-600 text-white rounded-full hover:from-blue-600 hover:to-indigo-600 dark:hover:from-blue-700 dark:hover:to-indigo-700 transition-all duration-300 shadow-md"
                aria-label="GitHub Profile"
              >
                <FiGithub size={18} />
              </motion.a>
              <motion.button
                onClick={scrollToTop}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-blue-600 dark:to-indigo-600 text-white rounded-full hover:from-blue-600 hover:to-indigo-600 dark:hover:from-blue-700 dark:hover:to-indigo-700 transition-all duration-300 shadow-md"
                aria-label="Back to Top"
              >
                <FiArrowUp size={18} />
              </motion.button>
            </div>

            {/* Additional Navigation Links */}
            <div className="flex gap-4 text-sm font-medium">
              <a
                href="/about"
                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                About
              </a>
              <a
                href="/contact"
                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Contact
              </a>
              <a
                href="/privacy"
                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Privacy
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}

export default Footer;
