import React from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Main Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="hover:text-gray-300">Home</Link></li>
              <li><Link href="/about" className="hover:text-gray-300">About</Link></li>
              <li><Link href="/services" className="hover:text-gray-300">Services</Link></li>
              <li><Link href="/blog" className="hover:text-gray-300">Blog</Link></li>
            </ul>
          </div>

          {/* Address */}
          <div>
            <h3 className="text-xl font-bold mb-4">Our Address</h3>
            <address className="not-italic">            
              Dublin<br />
              Ireland<br />              
            </address>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li>Phone: (+353) 083 067 3529</li>
              <li>Email: rayanrn8@hotmail.com</li>              
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="https://github.com/rayanreis" target="_blank" className="hover:text-gray-300 text-2xl">
                <FaGithub />
              </a>
              <a href="https://www.linkedin.com/in/rayanreis/" target="_blank" className="hover:text-gray-300 text-2xl">
                <FaLinkedin />
              </a>
              <a href="https://www.instagram.com/rayan.reis" target="_blank" className="hover:text-gray-300 text-2xl">
                <FaInstagram />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p>&copy; {new Date().getFullYear()} Rayan Fernandes. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 