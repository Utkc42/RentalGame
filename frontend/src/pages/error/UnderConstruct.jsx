//import React from 'react';
import { FaTools } from 'react-icons/fa';
import { MdBuild } from 'react-icons/md';

const UnderConstruct = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="mb-4">
        <FaTools className="text-6xl text-darkblue animate-bounce" />
      </div>
      <h1 className="text-3xl font-bold mb-6">Under Construction</h1>
      <div className="mb-4">
        <MdBuild className="text-6xl text-darkblue animate-bounce" />
      </div>
      <p className="text-lg text-center">This page is currently under construction. Please check back later.</p>
    </div>
  );
};

export default UnderConstruct;
