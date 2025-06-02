import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion } from 'lucide-react';
import Button from '../components/common/Button';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-surface-50">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="bg-primary-100 p-4 rounded-full">
            <FileQuestion size={64} className="text-primary-600" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold text-surface-900 mb-4">
          Page Not Found
        </h1>
        
        <p className="text-surface-700 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button as={Link} to="/" variant="primary">
            Go to Home
          </Button>
          
          <Button as={Link} to="/app" variant="outline">
            Go to App
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;