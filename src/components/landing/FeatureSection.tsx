import React from 'react';
import { motion } from 'framer-motion';
import { 
  Upload, 
  FileSearch, 
  MessageCircleQuestion, 
  Lightbulb,
  History,
  ExternalLink
} from 'lucide-react';
import Card from '../common/Card';

const FeatureSection: React.FC = () => {
  const features = [
    {
      icon: <Upload className="h-8 w-8 text-primary-600" />,
      title: "Easy Document Upload",
      description: "Drag and drop your PDF Terms & Conditions documents for instant analysis."
    },
    {
      icon: <FileSearch className="h-8 w-8 text-primary-600" />,
      title: "Smart Document Viewer",
      description: "View your document alongside the chat with navigation and search capabilities."
    },
    {
      icon: <MessageCircleQuestion className="h-8 w-8 text-primary-600" />,
      title: "AI-Powered Chat",
      description: "Ask questions about the document and get clear, context-aware answers."
    },
    {
      icon: <Lightbulb className="h-8 w-8 text-primary-600" />,
      title: "Legal Jargon Translation",
      description: "Complex legal terms explained in plain, easy-to-understand language."
    },
    {
      icon: <History className="h-8 w-8 text-primary-600" />,
      title: "Conversation History",
      description: "All your questions and answers are saved for future reference."
    },
    {
      icon: <ExternalLink className="h-8 w-8 text-primary-600" />,
      title: "Section References",
      description: "Answers include specific references to relevant document sections."
    },
  ];

  return (
    <section id="features" className="py-16 bg-surface-50">
      <div className="container-wide">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-surface-950 sm:text-4xl">
            Powerful Features for Document Analysis
          </h2>
          <p className="mt-4 text-lg text-surface-700 max-w-3xl mx-auto">
            Our intelligent platform makes it easy to understand complex legal documents without the headache.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <Card variant="premium" className="h-full p-6">
                <div className="mb-4 rounded-full bg-primary-50 p-2 w-fit">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-surface-900">{feature.title}</h3>
                <p className="mt-2 text-surface-700">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;