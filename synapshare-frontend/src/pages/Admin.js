import { useState, useEffect } from "react";
import axios from "axios";
import { auth } from "../firebase";

function Admin({ user }) {
  const [notes, setNotes] = useState([]);
  const [discussions, setDiscussions] = useState([]);
  const [nodes, setNodes] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    notesCount: 0,
    discussionsCount: 0,
    nodesCount: 0,
    usersCount: 0,
    activeUsers: 0,
    totalPosts: 0,
    postsThisWeek: 0,
    postsThisMonth: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!user || user.email !== "porwalkamlesh5@gmail.com") return;

      setLoading(true);
      setError("");
      setSuccess("");

      try {
        const token = await auth.currentUser.getIdToken();
        const API_URL =
          process.env.REACT_APP_API_URL || "http://localhost:5000";

        const endpoints = [
          { name: "notes", url: `${API_URL}/api/notes`, setter: setNotes },
          {
            name: "discussions",
            url: `${API_URL}/api/discussions`,
            setter: setDiscussions,
          },
          { name: "nodes", url: `${API_URL}/api/nodes`, setter: setNodes },
          { name: "users", url: `${API_URL}/api/users`, setter: setUsers },
        ];

        for (const { url, setter } of endpoints) {
          const response = await axios.get(url, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setter(response.data || []);
        }

        calculateStats();
      } catch (err) {
        console.error("Fetch error:", err);
        setError(
          `Failed to fetch data: ${err.response?.data?.message || err.message}`
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  useEffect(() => {
    calculateStats();
  }, [notes, discussions, nodes, users]);

  const calculateStats = () => {
    const now = new Date();
    const oneWeekAgo = new Date(now);
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const oneMonthAgo = new Date(now);
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const notesThisWeek = notes.filter(
      (note) => new Date(note.createdAt) > oneWeekAgo
    ).length;
    const notesThisMonth = notes.filter(
      (note) => new Date(note.createdAt) > oneMonthAgo
    ).length;
    const discussionsThisWeek = discussions.filter(
      (disc) => new Date(disc.createdAt) > oneWeekAgo
    ).length;
    const discussionsThisMonth = discussions.filter(
      (disc) => new Date(disc.createdAt) > oneMonthAgo
    ).length;
    const nodesThisWeek = nodes.filter(
      (node) => new Date(node.createdAt) > oneWeekAgo
    ).length;
    const nodesThisMonth = nodes.filter(
      (node) => new Date(node.createdAt) > oneMonthAgo
    ).length;

    const contentCreators = new Set();
    notes.forEach((note) => {
      if (note.uploadedBy) contentCreators.add(note.uploadedBy);
    });
    discussions.forEach((disc) => {
      if (disc.postedBy) contentCreators.add(disc.postedBy);
    });
    nodes.forEach((node) => {
      if (node.postedBy) contentCreators.add(node.postedBy);
    });

    setStats({
      notesCount: notes.length,
      discussionsCount: discussions.length,
      nodesCount: nodes.length,
      usersCount: users.length,
      activeUsers: contentCreators.size,
      totalPosts: notes.length + discussions.length + nodes.length,
      postsThisWeek: notesThisWeek + discussionsThisWeek + nodesThisWeek,
      postsThisMonth: notesThisMonth + discussionsThisMonth + nodesThisMonth,
    });
  };

  const handleDeletePost = async (type, id) => {
    setError("");
    setSuccess("");
    if (!auth.currentUser) {
      setError("User not authenticated");
      console.error("No authenticated user found");
      return;
    }

    try {
      console.log(`Attempting to delete ${type} with ID: ${id}`);
      const token = await auth.currentUser.getIdToken();
      const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
      const response = await axios.delete(
        `${API_URL}/api/admin/${type}/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Delete response:", response.data);

      if (type === "notes") setNotes(notes.filter((note) => note._id !== id));
      else if (type === "discussions")
        setDiscussions(discussions.filter((d) => d._id !== id));
      else if (type === "nodes")
        setNodes(nodes.filter((node) => node._id !== id));

      setSuccess(
        `${
          type.charAt(0).toUpperCase() + type.slice(1)
        } post deleted successfully!`
      );
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Delete post error:", err);
      setError(
        `Failed to delete ${type} post: ${
          err.response?.data?.message || err.message
        }`
      );
    }
  };

  const handleDeleteUser = async (uid) => {
    setError("");
    setSuccess("");
    if (!auth.currentUser) {
      setError("User not authenticated");
      console.error("No authenticated user found");
      return;
    }

    try {
      console.log(`Attempting to delete user with UID: ${uid}`);
      const token = await auth.currentUser.getIdToken();
      const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
      const response = await axios.delete(`${API_URL}/api/users/${uid}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Delete user response:", response.data);

      setUsers(users.filter((u) => u.uid !== uid));
      setSuccess("User deleted successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Delete user error:", err);
      setError(
        `Failed to delete user: ${err.response?.data?.message || err.message}`
      );
    }
  };

  if (!user || user.email !== "porwalkamlesh5@gmail.com") {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex flex-col">
        <div className="fixed inset-0 bg-gradient-to-b from-blue-50 to-transparent dark:from-blue-950 dark:to-transparent opacity-50 -z-10"></div>
        <p className="text-red-500 text-center py-16 bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-lg max-w-2xl mx-auto mt-16 relative z-10">
          Admin access required.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex flex-col">
      <div className="fixed inset-0 bg-gradient-to-b from-blue-50 to-transparent dark:from-blue-950 dark:to-transparent opacity-50 -z-10"></div>
      <section className="py-12 text-center relative z-10">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Admin Dashboard
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Manage notes, discussions, nodes, and users.
        </p>
      </section>

      {error && (
        <p className="text-red-500 mb-8 text-center bg-red-100/50 dark:bg-red-900/50 p-4 rounded-lg max-w-2xl mx-auto relative z-10">
          {error}
        </p>
      )}
      {success && (
        <p className="text-green-500 mb-8 text-center bg-green-100/50 dark:bg-green-900/50 p-4 rounded-lg max-w-2xl mx-auto relative z-10">
          {success}
        </p>
      )}
      {loading && (
        <p className="text-center text-gray-600 dark:text-gray-300 mb-8 relative z-10">
          Loading data...
        </p>
      )}

      <section className="mb-12 relative z-10">
        <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-6">
          Dashboard Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="group relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm hover:shadow-2xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-t from-blue-200 to-transparent dark:from-blue-900 dark:to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-2xl"></div>
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-2">
              Total Posts
            </h3>
            <div className="flex items-baseline">
              <p className="text-4xl font-bold text-gray-900 dark:text-white">
                {stats.totalPosts}
              </p>
              <p className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                posts
              </p>
            </div>
            <div className="mt-4 space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Notes</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {stats.notesCount}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">
                  Discussions
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {stats.discussionsCount}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Nodes</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {stats.nodesCount}
                </span>
              </div>
            </div>
          </div>

          <div className="group relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm hover:shadow-2xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-t from-blue-200 to-transparent dark:from-blue-900 dark:to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-2xl"></div>
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-2">
              User Statistics
            </h3>
            <div className="flex items-baseline">
              <p className="text-4xl font-bold text-gray-900 dark:text-white">
                {stats.usersCount}
              </p>
              <p className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                users
              </p>
            </div>
            <div className="mt-4 space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">
                  Active Users
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {stats.activeUsers}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">
                  Participation Rate
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {stats.usersCount
                    ? `${Math.round(
                        (stats.activeUsers / stats.usersCount) * 100
                      )}%`
                    : "0%"}
                </span>
              </div>
            </div>
          </div>

          <div className="group relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm hover:shadow-2xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-t from-blue-200 to-transparent dark:from-blue-900 dark:to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-2xl"></div>
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-2">
              This Week
            </h3>
            <div className="flex items-baseline">
              <p className="text-4xl font-bold text-gray-900 dark:text-white">
                {stats.postsThisWeek}
              </p>
              <p className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                new posts
              </p>
            </div>
            <div className="mt-4">
              {stats.totalPosts > 0 && (
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {Math.round((stats.postsThisWeek / stats.totalPosts) * 100)}
                    % of all posts
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="group relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm hover:shadow-2xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-t from-blue-200 to-transparent dark:from-blue-900 dark:to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-2xl"></div>
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-2">
              This Month
            </h3>
            <div className="flex items-baseline">
              <p className="text-4xl font-bold text-gray-900 dark:text-white">
                {stats.postsThisMonth}
              </p>
              <p className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                new posts
              </p>
            </div>
            <div className="mt-4">
              {stats.totalPosts > 0 && (
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {Math.round(
                      (stats.postsThisMonth / stats.totalPosts) * 100
                    )}
                    % of all posts
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mb-auto space-y-12 relative z-10">
        <div>
          <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-6">
            Notes
          </h2>
          {notes.length === 0 && !loading && (
            <p className="text-center text-gray-600 dark:text-gray-300">
              No notes available.
            </p>
          )}
          {notes.map((note) => (
            <div
              key={note._id}
              className="group relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 mb-4 hover:bg-blue-50 dark:hover:bg-blue-950 transition-all duration-300 shadow-lg hover:shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-blue-200 to-transparent dark:from-blue-900 dark:to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-2xl -z-10"></div>
              <div className="flex flex-col md:flex-row gap-6">
                {note.fileUrl && (
                  <div className="md:w-1/3">
                    {note.fileUrl.endsWith(".pdf") ? (
                      <a
                        href={note.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 dark:text-blue-400 hover:underline"
                      >
                        View PDF
                      </a>
                    ) : note.fileUrl.match(/\.(jpg|jpeg|png|gif)$/) ? (
                      <img
                        src={note.fileUrl}
                        alt={note.title || "Note Image"}
                        className="w-full h-48 object-cover rounded-lg"
                        onError={(e) => (e.target.style.display = "none")}
                      />
                    ) : note.fileUrl.match(/\.(mp4|webm)$/) ? (
                      <video controls className="w-full h-48 rounded-lg">
                        <source src={note.fileUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    ) : null}
                  </div>
                )}
                <div className={note.fileUrl ? "md:w-2/3" : "w-full"}>
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
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Subject: {note.subject || "N/A"}
                  </p>
                  <button
                    onClick={() => handleDeletePost("notes", note._id)}
                    className="bg-red-600 dark:bg-red-500 text-white font-semibold py-2 px-4 rounded-full hover:bg-red-700 dark:hover:bg-red-600 transition-all duration-300 shadow-md z-20 relative pointer-events-auto"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div>
          <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-6">
            Discussions
          </h2>
          {discussions.length === 0 && !loading && (
            <p className="text-center text-gray-600 dark:text-gray-300">
              No discussions available.
            </p>
          )}
          {discussions.map((discussion) => (
            <div
              key={discussion._id}
              className="group relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 mb-4 hover:bg-blue-50 dark:hover:bg-blue-950 transition-all duration-300 shadow-lg hover:shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-blue-200 to-transparent dark:from-blue-900 dark:to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-2xl -z-10"></div>
              <div className="flex flex-col md:flex-row gap-6">
                {discussion.fileUrl && (
                  <div className="md:w-1/3">
                    {discussion.fileUrl.endsWith(".pdf") ? (
                      <a
                        href={discussion.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 dark:text-blue-400 hover:underline"
                      >
                        View PDF
                      </a>
                    ) : discussion.fileUrl.match(/\.(jpg|jpeg|png|gif)$/) ? (
                      <img
                        src={discussion.fileUrl}
                        alt={discussion.title || "Discussion Image"}
                        className="w-full h-48 object-cover rounded-lg"
                        onError={(e) => (e.target.style.display = "none")}
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
                  <button
                    onClick={() =>
                      handleDeletePost("discussions", discussion._id)
                    }
                    className="bg-red-600 dark:bg-red-500 text-white font-semibold py-2 px-4 rounded-full hover:bg-red-700 dark:hover:bg-red-600 transition-all duration-300 shadow-md z-20 relative pointer-events-auto"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div>
          <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-6">
            Nodes
          </h2>
          {nodes.length === 0 && !loading && (
            <p className="text-center text-gray-600 dark:text-gray-300">
              No nodes available.
            </p>
          )}
          {nodes.map((node) => (
            <div
              key={node._id}
              className="group relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 mb-4 hover:bg-blue-50 dark:hover:bg-blue-950 transition-all duration-300 shadow-lg hover:shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-blue-200 to-transparent dark:from-blue-900 dark:to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-2xl -z-10"></div>
              <div className="flex flex-col md:flex-row gap-6">
                {node.fileUrl && (
                  <div className="md:w-1/3">
                    {node.fileUrl.endsWith(".pdf") ? (
                      <a
                        href={node.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 dark:text-blue-400 hover:underline"
                      >
                        View PDF
                      </a>
                    ) : node.fileUrl.match(/\.(jpg|jpeg|png|gif)$/) ? (
                      <img
                        src={node.fileUrl}
                        alt={node.title || "Node Image"}
                        className="w-full h-48 object-cover rounded-lg"
                        onError={(e) => (e.target.style.display = "none")}
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
                    <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg mb-4 text-sm font-mono">
                      {node.codeSnippet}
                    </pre>
                  )}
                  <button
                    onClick={() => handleDeletePost("nodes", node._id)}
                    className="bg-red-600 dark:bg-red-500 text-white font-semibold py-2 px-4 rounded-full hover:bg-red-700 dark:hover:bg-red-600 transition-all duration-300 shadow-md z-20 relative pointer-events-auto"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div>
          <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-6">
            Users
          </h2>
          {users.length === 0 && !loading && (
            <p className="text-center text-gray-600 dark:text-gray-300">
              No users available.
            </p>
          )}
          {users.map((u) => (
            <div
              key={u.uid}
              className="group relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 mb-4 hover:bg-blue-50 dark:hover:bg-blue-950 transition-all duration-300 shadow-lg hover:shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-blue-200 to-transparent dark:from-blue-900 dark:to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-2xl -z-10"></div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-blue-500 dark:bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  {u.username?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <div>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {u.username || "Unknown"}
                  </span>
                  <span className="block text-sm text-gray-500 dark:text-gray-400">
                    {u.createdAt
                      ? new Date(u.createdAt).toLocaleString()
                      : "Date N/A"}
                  </span>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Email: {u.email}
              </p>
              {u.email !== "porwalkamlesh5@gmail.com" && (
                <button
                  onClick={() => handleDeleteUser(u.uid)}
                  className="bg-red-600 dark:bg-red-500 text-white font-semibold py-2 px-4 rounded-full hover:bg-red-700 dark:hover:bg-red-600 transition-all duration-300 shadow-md z-20 relative pointer-events-auto"
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Admin;
