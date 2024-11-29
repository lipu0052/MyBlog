import React from 'react';
import { Button } from 'flowbite-react';
import { Link } from 'react-router-dom';

const CallToAction = () => {
  return (
    <section className="bg-blue-500 text-white py-10 mt-10 text-center">
      <h2 className="text-2xl font-bold">Stay Updated with Our Latest Posts!</h2>
      <p className="mt-3 text-lg">Don't miss out on our latest content. Subscribe to our newsletter to receive updates directly in your inbox.</p>
      <div className="mt-5 px-4 ">
        <Link to="/subscribe">
          <Button color="light" outline pill size="lg">
            Subscribe Now
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default CallToAction;
