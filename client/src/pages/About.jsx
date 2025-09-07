// src/pages/About.jsx
import React from "react";

const About = () => {
  return (
    <div className="pt-24 sm:pt-28 pb-12 bg-gray-50 min-h-[80vh]">
      <div className="max-w-5xl mx-auto px-6">
        <h1 className="text-4xl font-bold mb-4">About PicPrism</h1>
        <p className="text-lg text-gray-700 mb-6">
          PicPrism is a lightweight marketplace for creators and buyers where photographers and digital artists can sell their
          high-quality images and buyers can browse, favourite and purchase assets. Our goal is to make publishing, discovering
          and purchasing creative assets simple, fast and secure.
        </p>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-3">For creators</h2>
            <p className="text-gray-600 mb-4">
              Upload your work, manage inventory, and get paid. PicPrism provides an easy-to-use dashboard where you can add,
              edit and remove your posts, track earnings with analytics, and manage orders.
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Simple upload & management</li>
              <li>Soft-delete for preserving purchase history</li>
              <li>Built-in analytics and order management</li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-3">For buyers</h2>
            <p className="text-gray-600 mb-4">
              Browse high quality assets, add items to favourites, and purchase seamlessly with secure payment verification.
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Save favourites for later</li>
              <li>Secure checkout integration</li>
              <li>Easy downloads after purchase</li>
            </ul>
          </div>
        </section>

        <section className="mt-10">
          <h3 className="text-2xl font-semibold mb-3">Our values</h3>
          <p className="text-gray-700">
            We care about creative ownership, transparent fees, and fast performance. Built with a focus on developer ergonomics
            and a clean user experience.
          </p>
        </section>
      </div>
    </div>
  );
};

export default About;
