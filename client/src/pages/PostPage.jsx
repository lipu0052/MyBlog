import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Spinner, Button } from 'flowbite-react';
import CommentSection from '../components/Comment';
import CallToAction from '../components/CallToAction';

const PostPage = () => {
  const { postId } = useParams(); // Get the `postId` from the route
  const [post, setPost] = useState(null); // State for a single post
  const [loading, setLoading] = useState(true); // State for loading spinner
  const [error, setError] = useState(false); // State for error handling

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true); // Start loading
      setError(false); // Reset error state

      try {
        const res = await fetch(`http://localhost:3001/posts/${postId}`); // Adjusted API endpoint
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Failed to fetch the post.');
        }

        setPost(data.post); // Adjusted to use 'post' (not 'posts')
      } catch (err) {
        setError(true); // Show error state
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchPost();
  }, [postId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <p className="text-red-500 text-lg">Error loading the post.</p>
        <Link to="/">
          <Button color="gray" pill>
            Go Back to Home
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <main className="p-5 flex flex-col max-w-6xl mx-auto">
      <h1 className="text-3xl font-serif text-center mt-5">{post.title}</h1>
      <Link to={`/search?category=${post.category}`} className="self-center mt-3">
        <Button color="gray" pill size="xs">
          {post.category}
        </Button>
      </Link>
      <img
        src={post.image}
        alt={post.title}
        className="mt-5 max-h-[600px] w-full object-cover"
      />
      <div className="flex justify-between p-3 border-b border-gray-300 w-full max-w-2xl mx-auto text-sm">
        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        <span>{`${(post.content.length / 1000).toFixed(0)} min read`}</span>
      </div>
      <div
        className="p-3 max-w-2xl mx-auto post-content"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
      <CallToAction />
      <CommentSection postId={postId} /> {/* Replace with your comments component */}
    </main>
  );
};

export default PostPage;
