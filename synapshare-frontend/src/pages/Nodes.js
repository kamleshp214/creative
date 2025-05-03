import { useState, useEffect } from "react";
import axios from "axios";
import { auth } from "../firebase";
import {
  FaEdit,
  FaTrash,
  FaSave,
  FaShareAlt,
  FaArrowUp,
  FaArrowDown,
  FaComment,
} from "react-icons/fa";

function Nodes({ user, username }) {
  const [nodes, setNodes] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [codeSnippet, setCodeSnippet] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingNode, setEditingNode] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [showComments, setShowComments] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNodes();
  }, []);

  const fetchNodes = async () => {
    try {
      const token = await auth.currentUser?.getIdToken();
      const response = await axios.get("http://localhost:5000/api/nodes", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setNodes(response.data);
    } catch (err) {
      setError("Failed to fetch nodes.");
      console.error("Fetch nodes error:", err);
    }
  };

  const handlePost = async (e) => {
    e.preventDefault();
    if (!user || !username) {
      setError("Please log in to post.");
      return;
    }
    if (!title.trim() || !description.trim()) {
      setError("Title and description are required.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const token = await auth.currentUser.getIdToken();
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("codeSnippet", codeSnippet);
      if (file) formData.append("file", file);
      const res = await axios.post(
        "http://localhost:5000/api/nodes",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setNodes([...nodes, res.data]);
      setSuccess("Node posted successfully!");
      setTitle("");
      setDescription("");
      setCodeSnippet("");
      setFile(null);
      document.getElementById("fileInput").value = "";
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(
        `Failed to post node: ${err.response?.data?.error || err.message}`
      );
      console.error("Post node error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    if (!user || !username || !editingNode) return;
    if (!title.trim() || !description.trim()) {
      setError("Title and description are required.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const token = await auth.currentUser.getIdToken();
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("codeSnippet", codeSnippet);
      if (file) formData.append("file", file);
      const res = await axios.put(
        `http://localhost:5000/api/nodes/${editingNode._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setNodes(nodes.map((n) => (n._id === editingNode._id ? res.data : n)));
      setSuccess("Node updated successfully!");
      setEditingNode(null);
      setTitle("");
      setDescription("");
      setCodeSnippet("");
      setFile(null);
      document.getElementById("fileInput").value = "";
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(
        `Failed to update node: ${err.response?.data?.error || err.message}`
      );
      console.error("Edit node error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!user || !username) {
      setError("Please log in to delete.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const token = await auth.currentUser.getIdToken();
      const node = nodes.find((n) => n._id === id);
      if (node.postedBy !== username) {
        setError("You can only delete your own nodes.");
        return;
      }
      await axios.delete(`http://localhost:5000/api/nodes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNodes(nodes.filter((n) => n._id !== id));
      setSuccess("Node deleted successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to delete node.");
      console.error("Delete node error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (id, type) => {
    if (!user || !username) {
      setError("Please log in to vote.");
      return;
    }
    try {
      const token = await auth.currentUser.getIdToken();
      const response = await axios.post(
        `http://localhost:5000/api/nodes/${id}/${type}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNodes(nodes.map((n) => (n._id === id ? response.data : n)));
      setSuccess(`${type.charAt(0).toUpperCase() + type.slice(1)} successful!`);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(
        `Failed to ${type}: ${err.response?.data?.error || err.message}`
      );
      console.error("Vote error:", err.response?.data || err);
    }
  };

  const handleSave = async (id) => {
    if (!user || !username) {
      setError("Please log in to save.");
      return;
    }
    try {
      const token = await auth.currentUser.getIdToken();
      await axios.post(
        "http://localhost:5000/api/savedPosts",
        { postType: "node", postId: id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuccess("Node saved successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(
        `Failed to save node: ${err.response?.data?.error || err.message}`
      );
      console.error("Save node error:", err);
    }
  };

  const handleShare = (id) => {
    try {
      const url = `${window.location.origin}/nodes/${id}`;
      navigator.clipboard.writeText(url);
      setSuccess("Link copied to clipboard!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to copy link to clipboard.");
      console.error("Share error:", err);
    }
  };

  const handleComment = async (nodeId) => {
    if (!user || !username) {
      setError("Please log in to comment.");
      return;
    }
    if (!newComment.trim()) {
      setError("Comment cannot be empty.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const token = await auth.currentUser.getIdToken();
      const node = nodes.find((n) => n._id === nodeId);
      const updatedComments = [
        ...(node.comments || []),
        { content: newComment, postedBy: username, createdAt: new Date() },
      ];
      const response = await axios.put(
        `http://localhost:5000/api/nodes/${nodeId}`,
        { comments: updatedComments },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNodes(nodes.map((n) => (n._id === nodeId ? response.data : n)));
      setNewComment("");
      setSuccess("Comment added successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(
        `Failed to add comment: ${err.response?.data?.error || err.message}`
      );
      console.error("Comment error:", err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (node) => {
    setEditingNode(node);
    setTitle(node.title);
    setDescription(node.description);
    setCodeSnippet(node.codeSnippet || "");
    setFile(null);
    if (document.getElementById("fileInput"))
      document.getElementById("fileInput").value = "";
  };

  const toggleComments = (nodeId) => {
    setShowComments((prev) => ({ ...prev, [nodeId]: !prev[nodeId] }));
  };

  // eslint-disable-next-line no-unused-vars
  const handleFileDownload = (fileUrl, fileName) => {
    if (!fileUrl.startsWith("http://localhost:5000")) {
      setError("Invalid file URL");
      return;
    }
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileName || "download";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getVoteStatus = (node) => {
    if (!user || !username || !node.voters || !Array.isArray(node.voters)) {
      return { hasUpvoted: false, hasDownvoted: false };
    }
    const vote = node.voters.find((v) => v.username === username);
    return {
      hasUpvoted: vote && vote.voteType === "upvote",
      hasDownvoted: vote && vote.voteType === "downvote",
    };
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex flex-col relative">
      <div className="fixed inset-0 bg-gradient-to-b from-blue-50 to-transparent dark:from-blue-950 dark:to-transparent opacity-50 -z-10"></div>
      <section className="py-12 text-center relative z-10">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
          Nodes
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Share your code snippets, collaborate, and learn from the community.
        </p>
      </section>
      {user && username ? (
        <section className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-8 mb-8 shadow-lg relative z-10">
          {error && (
            <p className="text-red-500 dark:text-red-400 mb-4 text-center">
              {error}
            </p>
          )}
          {success && (
            <p className="text-green-500 dark:text-green-400 mb-4 text-center">
              {success}
            </p>
          )}
          <form
            onSubmit={editingNode ? handleEdit : handlePost}
            className="space-y-6"
          >
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Node Title"
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-300"
              required
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Share your description..."
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent h-32 transition-all duration-300"
              required
            />
            <textarea
              value={codeSnippet}
              onChange={(e) => setCodeSnippet(e.target.value)}
              placeholder="Code Snippet (optional)"
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent h-32 transition-all duration-300 font-mono"
            />
            <input
              id="fileInput"
              type="file"
              accept="image/*,application/pdf,video/mp4,video/webm"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 dark:file:bg-blue-900 file:text-blue-700 dark:file:text-blue-300 hover:file:bg-blue-100 dark:hover:file:bg-blue-800 transition-all duration-300"
            />
            {file && (
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Selected: {file.name} ({Math.round(file.size / 1024)} KB)
              </p>
            )}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 dark:bg-blue-500 text-white font-semibold py-3 px-6 rounded-full hover:bg-blue-700 dark:hover:bg-blue-600 disabled:bg-blue-300 dark:disabled:bg-blue-700 transition-all duration-300 shadow-md"
              >
                {loading ? "Posting..." : editingNode ? "Update" : "Post"}
              </button>
              {editingNode && (
                <button
                  onClick={() => {
                    setEditingNode(null);
                    setTitle("");
                    setDescription("");
                    setCodeSnippet("");
                    setFile(null);
                    document.getElementById("fileInput").value = "";
                  }}
                  className="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-500 font-semibold py-3 px-6 rounded-full transition-all duration-300"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>
      ) : (
        <p className="text-center text-gray-600 dark:text-gray-300 mb-8 relative z-10">
          Please log in to post nodes.
        </p>
      )}
      <section className="mb-auto space-y-8 relative z-10">
        {nodes.map((node) => {
          const { hasUpvoted, hasDownvoted } = getVoteStatus(node);
          return (
            <div
              key={node._id}
              className="group relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 hover:bg-blue-50 dark:hover:bg-blue-950 transition-all duration-300 shadow-lg hover:shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-blue-200 to-transparent dark:from-blue-900 dark:to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-2xl"></div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-blue-500 dark:bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  {node.postedBy.charAt(0).toUpperCase()}
                </div>
                <div>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {node.postedBy}
                  </span>
                  <span className="block text-sm text-gray-500 dark:text-gray-400">
                    {new Date(node.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                {node.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {node.description}
              </p>
              {node.codeSnippet && (
                <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg mb-4 text-sm font-mono text-gray-900 dark:text-gray-200 overflow-x-auto">
                  {node.codeSnippet}
                </pre>
              )}
              {node.fileUrl && (
                <div className="mb-4">
                  {node.fileUrl.endsWith(".pdf") ? (
                    <a
                      href={node.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 dark:text-blue-400 hover:underline"
                    >
                      Download PDF
                    </a>
                  ) : node.fileUrl.match(/\.(jpg|jpeg|png|gif)$/) ? (
                    <img
                      src={node.fileUrl}
                      alt="Attachment"
                      className="max-w-full h-auto rounded-lg"
                    />
                  ) : node.fileUrl.match(/\.(mp4|webm)$/) ? (
                    <video controls className="max-w-full h-auto rounded-lg">
                      <source src={node.fileUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : null}
                </div>
              )}
              <div className="flex items-center gap-6 mb-4">
                <button
                  onClick={() => handleVote(node._id, "upvote")}
                  disabled={!user}
                  className={`flex items-center gap-2 z-10 pointer-events-auto ${
                    hasUpvoted
                      ? "text-green-700 dark:text-green-600"
                      : "text-green-500 dark:text-green-400"
                  } hover:text-green-600 dark:hover:text-green-500 disabled:text-gray-400 dark:disabled:text-gray-500 transition-all duration-300`}
                >
                  <FaArrowUp /> {node.upvotes}
                </button>
                <button
                  onClick={() => handleVote(node._id, "downvote")}
                  disabled={!user}
                  className={`flex items-center gap-2 z-10 pointer-events-auto ${
                    hasDownvoted
                      ? "text-red-700 dark:text-red-600"
                      : "text-red-500 dark:text-red-400"
                  } hover:text-red-600 dark:hover:text-red-500 disabled:text-gray-400 dark:disabled:text-gray-500 transition-all duration-300`}
                >
                  <FaArrowDown /> {node.downvotes}
                </button>
              </div>
              {user && username && (
                <div className="flex gap-4">
                  {node.postedBy === username && (
                    <>
                      <button
                        onClick={() => startEditing(node)}
                        disabled={loading}
                        className="text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-500 transition-all duration-300 z-10 pointer-events-auto"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(node._id)}
                        disabled={loading}
                        className="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-500 transition-all duration-300 z-10 pointer-events-auto"
                      >
                        <FaTrash />
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleSave(node._id)}
                    disabled={!user}
                    className="text-yellow-500 dark:text-yellow-400 hover:text-yellow-600 dark:hover:text-yellow-500 transition-all duration-300 z-10 pointer-events-auto"
                  >
                    <FaSave />
                  </button>
                  <button
                    onClick={() => handleShare(node._id)}
                    className="text-purple-500 dark:text-purple-400 hover:text-purple-600 dark:hover:text-purple-500 transition-all duration-300 z-10 pointer-events-auto"
                  >
                    <FaShareAlt />
                  </button>
                  <button
                    onClick={() => toggleComments(node._id)}
                    className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-all duration-300 z-10 pointer-events-auto"
                  >
                    <FaComment /> {node.comments?.length || 0}
                  </button>
                </div>
              )}
              {showComments[node._id] && (
                <div className="mt-6">
                  {node.comments?.length ? (
                    node.comments.map((c, i) => (
                      <div
                        key={i}
                        className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-2"
                      >
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {c.content}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {c.postedBy} -{" "}
                          {new Date(c.createdAt).toLocaleString()}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      No comments yet.
                    </p>
                  )}
                  {user && username && (
                    <div className="flex gap-4 mt-4">
                      <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        className="flex-1 p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-300 z-10 pointer-events-auto"
                        disabled={loading}
                      />
                      <button
                        onClick={() => handleComment(node._id)}
                        disabled={loading}
                        className="bg-blue-600 dark:bg-blue-500 text-white font-semibold py-3 px-6 rounded-full hover:bg-blue-700 dark:hover:bg-blue-600 disabled:bg-blue-300 dark:disabled:bg-blue-700 transition-all duration-300 shadow-md z-10 pointer-events-auto"
                      >
                        {loading ? "Commenting..." : "Comment"}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
        {nodes.length === 0 && (
          <p className="text-center text-gray-600 dark:text-gray-300">
            No nodes yet.
          </p>
        )}
      </section>
    </div>
  );
}

export default Nodes;
