
import React from 'react';
import { Link } from 'react-router-dom';
import { House } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HomeButton = () => {
  return (
    <Button variant="outline" asChild className="absolute top-4 left-4">
      <Link to="/" className="flex items-center gap-2">
        <House className="w-4 h-4" />
        <span>Home</span>
      </Link>
    </Button>
  );
};

export default HomeButton;
