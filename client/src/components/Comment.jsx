import React, { useState, useEffect } from 'react';
import { Textarea, Button, Spinner } from 'flowbite-react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Fetch comments for the post
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3001/comments?postId=${postId}`, {
          withCredentials: true,
        });
        setComments(response.data.comments);
        setLoading(false);
      } catch (err) {
        setError('Failed to load comments');
        setLoading(false);
      }
    };

    fetchComments();
  }, [postId]);

  // Handle submitting a new comment
  const handleSubmit = async () => {
    if (!newComment.trim()) {
      return;
    }
    try {
      setSubmitting(true);
      const response = await axios.post(
        'http://localhost:3001/comments',
        { postId, content: newComment },
        { withCredentials: true }
      );
      setComments((prevComments) => [response.data.comment, ...prevComments]);
      setNewComment('');
      setSubmitting(false);
    } catch (err) {
      setError('Failed to post comment');
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Comments</h2>

      {/* Loading and Error States */}
      {loading ? (
        <div className="flex justify-center items-center">
          <Spinner size="lg" />
        </div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div>
          {/* Comment Input Section */}
          <div className="mb-6">
            <Textarea
              placeholder="Write your comment here..."
              rows={3}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              disabled={submitting}
            />
            <Button
              className="mt-3"
              onClick={handleSubmit}
              disabled={submitting || !newComment.trim()}
            >
              {submitting ? 'Posting...' : 'Post Comment'}
            </Button>
          </div>

          {/* Display Comments */}
          <div className="space-y-4">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div
                  key={comment._id}
                  className="border-b border-gray-200 pb-4"
                >
                  <div className="flex items-center mb-2">
                    <img
                      src={
                        comment.author.profileImg ||
                        'https://via.placeholder.com/50'
                      }
                      alt={comment.author.name}
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div>
                      <p className="font-medium">{comment.author.name}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(comment.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-700">{comment.content}</p>
                </div>
              ))
            ) : (
              <p>No comments yet. Be the first to comment!</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentSection;
