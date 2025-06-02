import React from 'react';
import { motion } from 'framer-motion';
import Card from '../common/Card';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Upload Your Document',
      description: 'Drag and drop your Terms & Conditions PDF file into the upload area.',
      color: 'bg-primary-100 text-primary-600',
    },
    {
      number: '02',
      title: 'Review the Document',
      description: 'View your document in the integrated PDF viewer with navigation controls.',
      color: 'bg-secondary-100 text-secondary-700',
    },
    {
      number: '03',
      title: 'Ask Questions',
      description: 'Use the chat interface to ask specific questions about the document.',
      color: 'bg-primary-100 text-primary-600',
    },
    {
      number: '04',
      title: 'Get Context-Aware Answers',
      description: 'Receive responses with references to specific sections of your document.',
      color: 'bg-secondary-100 text-secondary-700',
    },
  ];

  return (
    <section id="how-it-works" className="py-16 bg-surface-100">
      <div className="container-wide">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-surface-950 sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-surface-700 max-w-3xl mx-auto">
            Four simple steps to transform complex legal documents into clear, understandable information
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <Card variant="premium" className="h-full p-6 relative">
                <div className={`absolute -top-4 -left-4 rounded-full ${step.color} w-12 h-12 flex items-center justify-center font-bold text-lg shadow-md`}>
                  {step.number}
                </div>
                <div className="mt-4">
                  <h3 className="text-xl font-semibold text-surface-900">{step.title}</h3>
                  <p className="mt-2 text-surface-700">{step.description}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-lg text-surface-700 max-w-3xl mx-auto">
            Our system uses advanced AI to analyze the document and provide contextually relevant answers to your questions, saving you time and eliminating confusion.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;