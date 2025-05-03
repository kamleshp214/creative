/**
 * API configuration for SynapShare
 * This file centralizes API URL configuration for different environments
 */

// Use environment variable or fallback to localhost for development
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Helper function to construct endpoint URLs
const buildUrl = (endpoint) => `${API_URL}${endpoint}`;

// Common API endpoints
const endpoints = {
  // Auth endpoints
  user: (uid) => buildUrl(`/api/user/${uid}`),
  checkUsername: buildUrl('/api/check-username'),
  saveUsername: buildUrl('/api/save-username'),
  
  // Content endpoints
  notes: buildUrl('/api/notes'),
  note: (id) => buildUrl(`/api/notes/${id}`),
  noteUpvote: (id) => buildUrl(`/api/notes/${id}/upvote`),
  noteDownvote: (id) => buildUrl(`/api/notes/${id}/downvote`),
  
  discussions: buildUrl('/api/discussions'),
  discussion: (id) => buildUrl(`/api/discussions/${id}`),
  discussionUpvote: (id) => buildUrl(`/api/discussions/${id}/upvote`),
  discussionDownvote: (id) => buildUrl(`/api/discussions/${id}/downvote`),
  
  nodes: buildUrl('/api/nodes'),
  node: (id) => buildUrl(`/api/nodes/${id}`),
  nodeUpvote: (id) => buildUrl(`/api/nodes/${id}/upvote`),
  nodeDownvote: (id) => buildUrl(`/api/nodes/${id}/downvote`),
  
  // Other endpoints
  savedPosts: buildUrl('/api/savedPosts'),
  news: buildUrl('/api/news'),
  search: buildUrl('/api/search'),
  resetPassword: buildUrl('/api/request-password-reset'),
  
  // Admin endpoints
  adminDeleteNote: (id) => buildUrl(`/api/admin/notes/${id}`),
  adminDeleteDiscussion: (id) => buildUrl(`/api/admin/discussions/${id}`),
  adminDeleteNode: (id) => buildUrl(`/api/admin/nodes/${id}`),
};

export { API_URL, endpoints };
