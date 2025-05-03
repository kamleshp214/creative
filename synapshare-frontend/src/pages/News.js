import { useState, useEffect } from "react";
import axios from "axios";

function News() {
  const [news, setNews] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNews = async () => {
      try {
        // Fetching tech news only from NewsAPI
        const response = await axios.get(
          "https://newsapi.org/v2/top-headlines?country=us&category=technology&apiKey=7f7f546fbd314798a492cda57f6922d2"
        );
        setNews(response.data.articles || []); // Ensure it's an array
      } catch (err) {
        console.error("News Fetch Error:", err);
        setError("Failed to fetch tech news articles. Please try again later.");
      }
    };
    fetchNews();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex flex-col relative">
      {/* Background Gradient Overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-blue-50 to-transparent dark:from-blue-950 dark:to-transparent opacity-50 -z-10"></div>

      {/* Header Section */}
      <section className="py-12 text-center relative z-10">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
          Latest Tech News
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Stay updated with the latest trends and breakthroughs in technology.
        </p>
      </section>

      {/* Error Message */}
      {error && (
        <p className="text-red-500 dark:text-red-400 mb-8 text-center bg-red-100/50 dark:bg-red-900/50 p-4 rounded-lg max-w-2xl mx-auto relative z-10">
          {error}
        </p>
      )}

      {/* News Articles Section */}
      <section className="mb-auto space-y-8 relative z-10">
        {news.length === 0 && !error && (
          <p className="text-center text-gray-600 dark:text-gray-300">
            Loading tech news...
          </p>
        )}
        {news.map((article, index) => (
          <div
            key={index} // Ideally, use a unique identifier like article.url if available
            className="group relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 hover:bg-blue-50 dark:hover:bg-blue-950 transition-all duration-300 shadow-lg hover:shadow-2xl"
          >
            {/* Gradient Overlay on Hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-blue-200 to-transparent dark:from-blue-900 dark:to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-2xl"></div>

            {/* Article Content */}
            <div className="flex flex-col md:flex-row gap-6">
              {/* Image Section */}
              {article.urlToImage && (
                <div className="md:w-1/3">
                  <img
                    src={article.urlToImage}
                    alt={article.title || "News Image"}
                    className="w-full h-48 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.style.display = "none"; // Hide image if it fails to load
                    }}
                  />
                </div>
              )}

              {/* Text Section */}
              <div className={article.urlToImage ? "md:w-2/3" : "w-full"}>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                  {article.title || "No Title"}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {article.description || "No description available."}
                </p>
                <div className="flex items-center gap-4">
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 dark:text-blue-400 hover:underline z-10 pointer-events-auto"
                  >
                    Read more
                  </a>
                  {article.source?.name && (
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Source: {article.source.name}
                    </span>
                  )}
                  {article.publishedAt && (
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(article.publishedAt).toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

export default News;
