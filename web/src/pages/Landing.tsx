import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, MessageSquare, Moon, Search, Share2, Sun, Users, Menu } from "lucide-react";
import { useThemeStore } from "@/stores/ThemeStore/useThemeStore";
import { useState, useRef, useEffect } from "react";

export const Landing = () => {
  const { isDark, toggleTheme } = useThemeStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    };
    if (mobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileMenuOpen]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-neutral-950 dark:to-neutral-900">
      <nav className="fixed top-0 w-full bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-b border-gray-200 dark:border-neutral-800 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex justify-center items-center cursor-pointer select-none">
              <img src="/favicon.svg" className="size-8 sm:size-10" />
              <h1 className="font-extrabold text-xl sm:text-2xl text-blue-600">CacheUpp</h1>
            </div>

            {/* Mobile menu button - wrapped in ref container */}
            <div className="flex md:hidden" ref={mobileMenuRef}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </motion.button>

              {/* Mobile menu dropdown - included inside the ref container */}
              {mobileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="absolute top-16 right-2 w-56 md:hidden bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-gray-200 dark:border-neutral-700 overflow-hidden"
                >
                  <div className="p-2">
                    {/* Navigation Links */}
                    <div className="p-2 space-y-2">
                      <button 
                        onClick={toggleTheme} 
                        className="flex items-center w-full px-4 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-md transition-colors"
                      >
                        {isDark ? 
                          <Sun className="size-5 mr-2" /> : 
                          <Moon className="size-5 mr-2" />
                        }
                        <span className="text-gray-800 dark:text-gray-200">
                          {isDark ? "Light Mode" : "Dark Mode"}
                        </span>
                      </button>
                      <Link
                        to="/signin"
                        className="block w-full px-4 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-md transition-colors"
                      >
                        Sign In
                      </Link>
                      <Link
                        to="/verify-email"
                        className="block w-full px-4 py-2 text-left text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                      >
                        Get Started
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Desktop navigation */}
            <div className="hidden md:flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                )}
              </motion.button>
              <Link
                to="/signin"
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/verify-email"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-12 pt-20 md:py-20 flex flex-col md:flex-row items-center min-h-screen">
          {/* Text content section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="w-full md:w-1/2 mb-8 md:mb-0"
          >
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
            >
              For catching up with{" "}
              Friends{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-500">No Caching</span>{" "}
              Required
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.7 }}
              className="text-xl text-gray-600 dark:text-gray-300 mb-8"
            >
              Join our vibrant community where you can share moments, connect with friends, and explore forums with
              powerful vector search.
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.7 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link to="/verify-email">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  Get Started <ArrowRight size={18} />
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Animation section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="w-full md:w-1/2 relative"
          >
            <div className="block relative h-[250px] sm:h-[300px] md:h-[400px] w-full">
              {/* Top floating card */}
              <motion.div
                initial={{ y: 0 }}
                animate={{ y: [0, -15, 0] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 3, ease: "easeInOut" }}
                className="absolute top-0 left-[5%] md:left-[10%] bg-white dark:bg-neutral-800 p-3 sm:p-4 md:p-6 rounded-xl shadow-xl w-[80%] sm:w-[70%] md:max-w-none"
              >
                <div className="w-full h-24 sm:h-32 md:h-48 bg-gray-100 dark:bg-gray-700 rounded-lg mb-2 md:mb-4"></div>
                <div className="h-2 sm:h-3 md:h-4 w-3/4 bg-gray-200 dark:bg-gray-600 rounded mb-1 md:mb-2"></div>
                <div className="h-2 sm:h-3 md:h-4 w-1/2 bg-gray-200 dark:bg-gray-600 rounded"></div>
              </motion.div>

              {/* Bottom floating card */}
              <motion.div
                initial={{ y: 0 }}
                animate={{ y: [0, 15, 0] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 4, ease: "easeInOut" }}
                className="absolute bottom-0 right-[5%] md:right-[10%] bg-white dark:bg-neutral-800 p-3 sm:p-4 md:p-6 rounded-xl shadow-xl w-[80%] sm:w-[70%] md:max-w-none"
              >
                <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 mb-2 md:mb-4">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-blue-200 dark:bg-blue-400"></div>
                  <div>
                    <div className="h-2 sm:h-2.5 md:h-3 w-14 sm:w-16 md:w-20 bg-gray-200 dark:bg-gray-600 rounded mb-1"></div>
                    <div className="h-2 sm:h-2.5 md:h-3 w-10 sm:w-12 md:w-16 bg-gray-200 dark:bg-gray-600 rounded"></div>
                  </div>
                </div>
                <div className="h-16 sm:h-20 md:h-24 w-full bg-gray-100 dark:bg-gray-700 rounded-lg mb-2 md:mb-3"></div>
                <div className="flex justify-between max-w-[100px] sm:max-w-[120px] md:max-w-[140px]">
                  <div className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 rounded-full bg-gray-200 dark:bg-gray-600"></div>
                  <div className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 rounded-full bg-gray-200 dark:bg-gray-600"></div>
                  <div className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 rounded-full bg-gray-200 dark:bg-gray-600"></div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-white dark:bg-neutral-900">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Everything you need to connect, share, and discover in one platform
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
              {[
                {
                  icon: <Share2 size={24} className="text-blue-600" />,
                  title: "Share Posts",
                  description:
                    "Share your moments, thoughts, and experiences with your network through engaging posts.",
                },
                {
                  icon: <Users size={24} className="text-blue-600" />,
                  title: "Connect with Friends",
                  description:
                    "Build your network by connecting with friends, family, and like-minded individuals.",
                },
                {
                  icon: <MessageSquare size={24} className="text-blue-600" />,
                  title: "Join Forums",
                  description:
                    "Participate in topic-based forums to discuss your interests with the community.",
                },
                {
                  icon: <Search size={24} className="text-blue-600" />,
                  title: "Vector Search",
                  description:
                    "Find exactly what you're looking for with our powerful vector search technology.",
                },
                {
                  icon: <MessageSquare size={24} className="text-blue-600" />,
                  title: "Real-time Chat",
                  description:
                    "Stay connected with private and group chats featuring real-time messaging.",
                },
                {
                  icon: <Users size={24} className="text-blue-600" />,
                  title: "Community Events",
                  description:
                    "Discover and participate in virtual and local events with your community.",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -5 }}
                  className="bg-gray-50 dark:bg-neutral-800 p-6 sm:p-7 md:p-8 rounded-xl shadow-sm hover:shadow-md transition-all"
                >
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-white dark:bg-neutral-900">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl p-8 md:p-16 text-center"
            >
              <motion.h2
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.7 }}
                className="text-3xl md:text-4xl font-bold text-white mb-6"
              >
                Ready to join our community?
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.7 }}
                className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto"
              >
                Sign up today and start connecting with friends, sharing moments, and discovering new communities.
              </motion.p>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, duration: 0.7 }}
              >
                <Link to="/verify-email">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Get Started for Free
                  </motion.button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-50 bg-gradient-to-b dark:from-neutral-900 dark:to-neutral-950 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <p className="text-sm sm:text-base">© {new Date().getFullYear()} CacheUpp. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;