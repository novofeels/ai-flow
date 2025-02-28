// src/app/components/Topbar.tsx
"use client";

import React from "react";
import Image from "next/image";

const Topbar = () => {
  return (
    <header className="bg-gray-800 text-white flex items-center p-4">
      <div className="flex items-center">
        {/* Replace '/logo.png' with your actual logo path */}
        <Image src="/SHORE-LOGO-BLACK.png" alt="Logo" width={100} height={100} style={{ filter: 'invert(1)' }} className='mr-2'/>
        <Image src="/Line.svg" alt="line" width={1} height={1} style={{ filter: 'invert(1)' }}/>

        <h1 className="ml-3 text-xl font-bold">researching text</h1>
      </div>

    </header>
  );
};

export default Topbar;
