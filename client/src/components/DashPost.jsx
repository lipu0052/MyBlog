import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { TextInput, Select, FileInput, Button, Alert, Card, Modal } from 'flowbite-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { app } from '../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import sanitizeHtml from 'sanitize-html';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { useNavigate, Link } from 'react-router-dom';

const DashPost = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 12;

  // Sorting State
  const [sortBy, setSortBy] = useState('newest');

  // Fetch Posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:3001/posts', { withCredentials: true });
        setPosts(response.data.posts);
      } catch (err) {
        setError('Failed to fetch posts');
      }
    };
    fetchPosts();
  }, []);

  // Handle Delete Post
  const handleDeletePost = async () => {
    if (!selectedPostId) return;

    try {
      await axios.delete(`http://localhost:3001/deletePost/${selectedPostId}`, { withCredentials: true });
      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== selectedPostId));
      setShowModal(false);
      setSelectedPostId(null);
    } catch (error) {
      setError('Failed to delete post');
    }
  };

  // Sort posts based on selected criteria
  const sortedPosts = useMemo(() => {
    return [...posts].sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortBy === 'oldest') {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
      return 0;
    });
  }, [posts, sortBy]);

  // Pagination Calculations
  const lastPostIndex = currentPage * postsPerPage;
  const firstPostIndex = lastPostIndex - postsPerPage;
  const currentPosts = sortedPosts.slice(firstPostIndex, lastPostIndex);

  // Handle Next Page
  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  // Handle Previous Page
  const handlePrevPage = () => {
    setCurrentPage((prevPage) => (prevPage > 1 ? prevPage - 1 : prevPage));
  };

  return (
    <div className="min-h-screen p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">All Posts</h2>
      {error && <Alert color="failure">{error}</Alert>}

      {/* Sort By Dropdown */}
      <div className="flex justify-end items-center mb-2">
        <label htmlFor="sortBy" className="text-sm font-medium m-2">Sort by:</label>
        <select
          id="sortBy"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="p-2 border rounded-lg bg-gray-100 text-gray-700"
        >
          <option value="newest" className="text-gray-700">Newest</option>
          <option value="oldest" className="text-gray-700">Oldest</option>
        </select>
      </div>

      {/* Display Posts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentPosts.length > 0 ? (
          currentPosts.map((post) => (
            <div key={post._id}>
              <Card className="rounded-lg shadow-lg overflow-hidden">
                <p className="text-xs text-gray-500 mb-1">
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
                {post.image && (
                  <Link to={`/post/${post._id}`}>
                    <img src={post.image} alt={post.title || 'Post Image'} className="h-40 w-full object-cover" />

                  </Link>
                )}

                <h3 className="text-xl font-bold ">{post.slug || 'Untitled'}</h3>
                <p className="text-sm text-gray-600 ">{post.category}</p>
                <div className="flex justify-between gap-2 items-center ">
                  <Button
                    color="red"
                    onClick={() => {
                      setSelectedPostId(post._id);
                      setShowModal(true);
                    }}
                  >
                    Delete
                  </Button>
                  <Button onClick={() => navigate(`/editpost/${post._id}`)}>Edit</Button>
                </div>

              </Card>
            </div>
          ))
        ) : (
          <p>No posts available</p>
        )}
      </div>
      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-6">
        <Button onClick={handlePrevPage} disabled={currentPage === 1}>
          Previous
        </Button>
        <Button onClick={handleNextPage} disabled={lastPostIndex >= posts.length}>
          Next
        </Button>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-700 mx-auto mb-2 dark:text-gray-200" />
            <h1 className="text-xl font-semibold">Are you sure you want to delete this post?</h1>
            <div className="flex justify-between h-8 mt-2">
              <Button color="failure" outline onClick={handleDeletePost}>Yes</Button>
              <Button color="success" outline onClick={() => setShowModal(false)}>No</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DashPost;
