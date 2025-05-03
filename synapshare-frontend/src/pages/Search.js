import { useState, useEffect } from "react";
import axios from "axios";
import { auth } from "../firebase";

function Search({ user }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [notes, setNotes] = useState([]);
  const [discussions, setDiscussions] = useState([]);
  const [nodes, setNodes] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Log user state for debugging
  useEffect(() => {
    console.log("User State:", user);
    if (user) {
      console.log("User Email:", user.email);
    } else {
      console.log("User is null or undefined.");
    }
  }, [user]);

  // Reset results when search term changes
  useEffect(() => {
    setNotes([]);
    setDiscussions([]);
    setNodes([]);
    setError("");
  }, [searchTerm]);

  // Handle search
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setError("Please enter a search term.");
      return;
    }
    if (!user || !user.email) {
      setError("You must be logged in to search. User data unavailable.");
      console.log("User check failed:", user);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const token = await auth.currentUser.getIdToken();
      console.log(
        "Fetching search results with token:",
        token.substring(0, 10) + "..."
      );
      const response = await axios.get(
        `http://localhost:5000/api/search?q=${searchTerm}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Search Results:", response.data);

      setNotes(response.data.notes || []);
      setDiscussions(response.data.discussions || []);
      setNodes(response.data.nodes || []);
    } catch (err) {
      console.error("Search Error:", err);
      setError(
        `Failed to search: ${err.response?.status} - ${
          err.response?.data?.message || err.message
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex flex-col relative">
      {/* Background Gradient Overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-blue-50 to-transparent dark:from-blue-950 dark:to-transparent opacity-50 -z-10"></div>

      {/* Header Section */}
      <section className="py-12 text-center relative z-10">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
          Search SynapShare
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Find notes, discussions, and nodes shared by the community.
        </p>
      </section>

      {/* Search Form */}
      <section className="mb-8 relative z-10">
        <form onSubmit={handleSearch} className="flex justify-center gap-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search notes, discussions, or nodes..."
            className="w-full max-w-lg p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-300"
          />
          <button
            type="submit"
            className="bg-blue-600 dark:bg-blue-500 text-white font-semibold py-3 px-6 rounded-full hover:bg-blue-700 dark:hover:bg-blue-600 disabled:bg-blue-300 dark:disabled:bg-blue-700 transition-all duration-300 shadow-md"
            disabled={loading}
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </form>
      </section>

      {/* Error Message */}
      {error && (
        <p className="text-red-500 dark:text-red-400 mb-8 text-center bg-red-100/50 dark:bg-red-900/50 p-4 rounded-lg max-w-2xl mx-auto relative z-10">
          {error}
        </p>
      )}

      {/* Search Results */}
      <section className="mb-auto space-y-12 relative z-10">
        {/* Notes Section */}
        <div>
          <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-6">
            Notes
          </h2>
          {notes.length === 0 && !loading && (
            <p
              className="text-center text-gray-6
00 dark:text-gray-300"
            >
              No notes found.
            </p>
          )}
          {notes.map((note) => (
            <div
              key={note._id}
              className="group relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 hover:bg-blue-50 dark:hover:bg-blue-950 transition-all duration-300 shadow-lg hover:shadow-2xl mb-4"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-blue-200 to-transparent dark:from-blue-900 dark:to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-2xl"></div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-blue-500 dark:bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  {note.uploadedBy?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <div>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {note.uploadedBy || "Unknown"}
                  </span>
                  <span className="block text-sm text-gray-500 dark:text-gray-400">
                    {note.createdAt
                      ? new Date(note.createdAt).toLocaleString()
                      : "Date N/A"}
                  </span>
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                {note.title || "Untitled"}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                Subject: {note.subject || "N/A"}
              </p>
            </div>
          ))}
        </div>

        {/* Discussions Section */}
        <div>
          <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-6">
            Discussions
          </h2>
          {discussions.length === 0 && !loading && (
            <p className="text-center text-gray-600 dark:text-gray-300">
              No discussions found.
            </p>
          )}
          {discussions.map((discussion) => (
            <div
              key={discussion._id}
              className="group relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 hover:bg-blue-50 dark:hover:bg-blue-950 transition-all duration-300 shadow-lg hover:shadow-2xl mb-4"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-blue-200 to-transparent dark:from-blue-900 dark:to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-2xl"></div>
              <div className="flex flex-col md:flex-row gap-6">
                {discussion.fileUrl && (
                  <div className="md:w-1/3">
                    {discussion.fileUrl.endsWith(".pdf") ? (
                      <div className="text-center">
                        <a
                          href={discussion.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 dark:text-blue-400 hover:underline"
                        >
                          View PDF
                        </a>
                      </div>
                    ) : discussion.fileUrl.match(/\.(jpg|jpeg|png|gif)$/) ? (
                      <img
                        src={discussion.fileUrl}
                        alt={discussion.title || "Discussion Image"}
                        className="w-full h-48 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    ) : discussion.fileUrl.match(/\.(mp4|webm)$/) ? (
                      <video controls className="w-full h-48 rounded-lg">
                        <source src={discussion.fileUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    ) : null}
                  </div>
                )}
                <div className={discussion.fileUrl ? "md:w-2/3" : "w-full"}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 bg-blue-500 dark:bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                      {discussion.postedBy?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <div>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {discussion.postedBy || "Unknown"}
                      </span>
                      <span className="block text-sm text-gray-500 dark:text-gray-400">
                        {discussion.createdAt
                          ? new Date(discussion.createdAt).toLocaleString()
                          : "Date N/A"}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                    {discussion.title || "Untitled"}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {discussion.content || "No content available."}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Nodes Section */}
        <div>
          <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-6">
            Nodes
          </h2>
          {nodes.length === 0 && !loading && (
            <p className="text-center text-gray-600 dark:text-gray-300">
              No nodes found.
            </p>
          )}
          {nodes.map((node) => (
            <div
              key={node._id}
              className="group relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 hover:bg-blue-50 dark:hover:bg-blue-950 transition-all duration-300 shadow-lg hover:shadow-2xl mb-4"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-blue-200 to-transparent dark:from-blue-900 dark:to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-2xl"></div>
              <div className="flex flex-col md:flex-row gap-6">
                {node.fileUrl && (
                  <div className="md:w-1/3">
                    {node.fileUrl.endsWith(".pdf") ? (
                      <div className="text-center">
                        <a
                          href={node.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 dark:text-blue-400 hover:underline"
                        >
                          View PDF
                        </a>
                      </div>
                    ) : node.fileUrl.match(/\.(jpg|jpeg|png|gif)$/) ? (
                      <img
                        src={node.fileUrl}
                        alt={node.title || "Node Image"}
                        className="w-full h-48 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    ) : node.fileUrl.match(/\.(mp4|webm)$/) ? (
                      <video controls className="w-full h-48 rounded-lg">
                        <source src={node.fileUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    ) : null}
                  </div>
                )}
                <div className={node.fileUrl ? "md:w-2/3" : "w-full"}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 bg-blue-500 dark:bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                      {node.postedBy?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <div>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {node.postedBy || "Unknown"}
                      </span>
                      <span className="block text-sm text-gray-500 dark:text-gray-400">
                        {node.createdAt
                          ? new Date(node.createdAt).toLocaleString()
                          : "Date N/A"}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                    {node.title || "Untitled"}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-2">
                    {node.description || "No description available."}
                  </p>
                  {node.codeSnippet && (
                    <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg mb-4 text-sm font-mono text-gray-900 dark:text-gray-200 overflow-x-auto">
                      {node.codeSnippet}
                    </pre>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Search;
