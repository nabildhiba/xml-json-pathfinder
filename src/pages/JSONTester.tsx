
import React from 'react';
import CodeEditor from "@/components/CodeEditor";
import HomeButton from '@/components/HomeButton';

const JSONTester = () => {
  return (
    <div className="relative">
      <HomeButton />
      <CodeEditor defaultTab="json" hideHeader={false} />
    </div>
  );
};

export default JSONTester;
