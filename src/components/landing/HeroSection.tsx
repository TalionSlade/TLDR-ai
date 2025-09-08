import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, MessageSquare, SearchCheck } from 'lucide-react';
import Button from '../common/Button';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10
      }
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 py-16 sm:py-24 lg:py-32">
      {/* Abstract background patterns */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-white blur-3xl" />
        <div className="absolute right-1/4 bottom-1/4 h-64 w-64 rounded-full bg-secondary-400 blur-3xl" />
      </div>

      <div className="container-wide relative">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 
            className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl"
            variants={itemVariants}
          >
            Understand Legal Documents 
            <span className="block text-secondary-300">With AI-Powered Analysis</span>
          </motion.h1>

          <motion.p 
            className="mt-6 text-lg text-white/90 sm:text-xl"
            variants={itemVariants}
          >
            Upload your Terms & Conditions documents and get instant insights in plain language. 
            Ask questions, extract key points, and understand legal jargon effortlessly.
          </motion.p>

          <motion.div 
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
            variants={itemVariants}
          >
            <Button 
              size="lg"
              onClick={() => navigate('/app')}
              className="w-full sm:w-auto"
            >
              Get Started
            </Button>
            <Button 
              variant="secondary" 
              size="lg" 
              className="w-full sm:w-auto"
              onClick={() => window.open('#how-it-works', '_self')}
            >
              Learn More
            </Button>
          </motion.div>
        </motion.div>

        <motion.div 
          className="mt-16 grid gap-8 md:grid-cols-3"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 p-6 text-white">
            <FileText className="mb-4 h-8 w-8 text-secondary-200" />
            <h3 className="text-xl font-semibold">Upload Documents</h3>
            <p className="mt-2 text-white/90">Simply drag and drop your PDF Terms & Conditions document to get started.</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 p-6 text-white">
            <SearchCheck className="mb-4 h-8 w-8 text-secondary-200" />
            <h3 className="text-xl font-semibold">Analyze Content</h3>
            <p className="mt-2 text-white/90">Our AI automatically processes the document and extracts key information.</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 p-6 text-white">
            <MessageSquare className="mb-4 h-8 w-8 text-secondary-200" />
            <h3 className="text-xl font-semibold">Ask Questions</h3>
            <p className="mt-2 text-white/90">Chat with our AI to understand specific clauses and get explanations in simple language.</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;