import React from "react";

import { Footer } from "flowbite-react";
import { FaHeart } from "react-icons/fa";
import {
  RiGithubFill,
  RiTwitterFill,
  RiLinkedinFill,
  RiInstagramFill,
} from "react-icons/ri";

const Foot = () => (
  <div>
    <Footer
      container
      className="w-full flex flex-col border border-t-8 border-teal-700 p-4"
    >
      <div className="w-full flex justify-start items-center ">
        <div className=" grid grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-6">
          <div className="w-full ">
            <Footer.Title title="Company" />
            <Footer.LinkGroup className="space-y-1" col={true}>
              <Footer.Link href="#">About</Footer.Link>
              <Footer.Link href="#">Blog</Footer.Link>
              <Footer.Link href="#">Jobs</Footer.Link>
            </Footer.LinkGroup>
          </div>

          <div className="w-full ">
            <Footer.Title title="Product" />
            <Footer.LinkGroup className="space-y-1" col={true}>
              <Footer.Link href="#">Features</Footer.Link>
              <Footer.Link href="#">Marketplace</Footer.Link>
              <Footer.Link href="#">Pricing</Footer.Link>
            </Footer.LinkGroup>
          </div>
          <div className="w-full">
            <Footer.Title title="Support" />
            <Footer.LinkGroup className="space-y-1" col={true}>
              <Footer.Link href="#">Help Center</Footer.Link>
              <Footer.Link href="#">Terms of Service</Footer.Link>
              <Footer.Link href="#">Legal</Footer.Link>
            </Footer.LinkGroup>
          </div>
        </div>
      </div>
      <Footer.Divider />
      <div className="flex text-xs  gap-4 flex-col md:flex-row lg:flex-row justify-center  items-center">
        <div className="w-full">
          <p className="text-gray-600">
            Made with <FaHeart className="inline text-red-500" /> by Your Name
          </p>
          <p className="text-gray-600">
            © {new Date().getFullYear()} All rights reserved
          </p>
        </div>
        <div className="flex space-x-1">
          <a
            href="https://github.com/yourgithub"
            target="_blank"
            rel="noopener noreferrer"
          >
            <RiGithubFill
              className="text-gray-600 hover:text-gray-900 transition duration-300"
              size={24}
            />
          </a>
          <a
            href="https://twitter.com/yourtwitter"
            target="_blank"
            rel="noopener noreferrer"
          >
            <RiTwitterFill
              className="text-gray-600 hover:text-blue-500 transition duration-300"
              size={24}
            />
          </a>
          <a
            href="https://instagram.com/yourinstagram"
            target="_blank"
            rel="noopener noreferrer"
          >
            <RiInstagramFill
              className="text-gray-600 hover:text-blue-500 transition duration-300"
              size={24}
            />
          </a>
          <a
            href="https://www.linkedin.com/in/yourlinkedin"
            target="_blank"
            rel="noopener noreferrer"
          >
            <RiLinkedinFill
              className="text-gray-600 hover:text-blue-600 transition duration-300"
              size={24}
            />
          </a>
        </div>
      </div>
    </Footer>
  </div>
);

export default Foot;
