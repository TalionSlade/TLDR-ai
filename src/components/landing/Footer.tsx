import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Github, Twitter, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-surface-950 text-white py-12">
      <div className="container-wide">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <FileText size={24} className="text-primary-500" />
              <span className="text-xl font-display font-bold">
                LegalLens
              </span>
            </Link>
            <p className="mt-4 text-surface-400">
              Simplifying legal document analysis with AI-powered insights and natural language interaction.
            </p>
            <div className="mt-6 flex gap-4">
              <a href="#" className="text-surface-400 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-surface-400 hover:text-white transition-colors">
                <Github size={20} />
              </a>
              <a href="#" className="text-surface-400 hover:text-white transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Product</h3>
            <ul className="space-y-3">
              <li><a href="#features" className="text-surface-400 hover:text-white transition-colors">Features</a></li>
              <li><a href="#how-it-works" className="text-surface-400 hover:text-white transition-colors">How It Works</a></li>
              <li><a href="#" className="text-surface-400 hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" className="text-surface-400 hover:text-white transition-colors">Enterprise</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-surface-400 hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#" className="text-surface-400 hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="text-surface-400 hover:text-white transition-colors">Support</a></li>
              <li><a href="#" className="text-surface-400 hover:text-white transition-colors">API</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-surface-400 hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="text-surface-400 hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="text-surface-400 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-surface-400 hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-surface-800 text-center text-surface-500">
          <p>© {new Date().getFullYear()} LegalLens. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;