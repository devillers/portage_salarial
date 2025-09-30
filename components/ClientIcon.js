'use client';

import * as LucideIcons from 'lucide-react';

export default function ClientIcon({ name, className, ...props }) {
  const IconComponent = LucideIcons[name];
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in lucide-react`);
    return null;
  }
  
  return <IconComponent className={className} {...props} />;
}