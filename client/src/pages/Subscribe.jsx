import React, { useState } from 'react';
import { Button} from 'flowbite-react';
import { TextInput } from 'flowbite-react'; // Ensure this matches the official docs



const Subscribe = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null); // For success or error messages
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null); // Reset status on submit

    try {
      const response = await fetch('http://localhost:3001/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({ type: 'success', message: 'Thank you for subscribing!' });
        setEmail(''); // Clear email input
      } else {
        setStatus({ type: 'error', message: data.message || 'Something went wrong. Please try again later.' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Failed to connect to the server. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl min-h-screen mx-auto mt-10 p-5">
      <h1 className="text-2xl font-bold text-center">Subscribe to Our Newsletter</h1>
      <p className="text-center mt-3">Stay updated with our latest posts and updates.</p>

      {status && (
        <div className={`mt-5 text-center ${status.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
          {status.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-5">
        <div className="flex flex-col items-center">
          <TextInput
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="mb-3 w-full max-w-md"
          />
          <Button type="submit" color="blue" pill disabled={loading}>
            {loading ? 'Subscribing...' : 'Subscribe'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Subscribe;
