import React from 'react';
import SystemErrorScreen from '@/components/desktop/SystemErrorScreen';
import './globals.css';

export default function NotFound() {
  return (
    <html>
      <body>
        <div className="w-screen h-screen antialiased bg-[#0052a3] text-white overflow-hidden m-0 p-0">
          <SystemErrorScreen type="404" />
        </div>
      </body>
    </html>
  );
}
