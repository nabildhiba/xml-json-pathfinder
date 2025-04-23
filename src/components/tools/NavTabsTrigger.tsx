
import React from 'react';
import { TabsTrigger } from "@/components/ui/tabs";
import { Link } from 'react-router-dom';

interface NavTabsTriggerProps {
  value: string;
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const NavTabsTrigger: React.FC<NavTabsTriggerProps> = ({ value, to, icon, children }) => (
  <TabsTrigger 
    value={value}
    className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white px-4"
    asChild
  >
    <Link to={to} className="flex items-center gap-2 w-full justify-center">
      {icon}
      {children}
    </Link>
  </TabsTrigger>
);

export default NavTabsTrigger;
