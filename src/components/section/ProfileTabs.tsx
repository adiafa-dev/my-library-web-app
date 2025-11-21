import { useState } from 'react';

export function ProfileTabs({ active, setActive }) {
  return (
    <div className='flex gap-3 bg-neutral-100 rounded-full p-1 w-fit'>
      {['profile', 'borrowed', 'reviews'].map((tab) => (
        <button
          key={tab}
          onClick={() => setActive(tab)}
          className={`px-6 py-2 rounded-full font-semibold ${
            active === tab ? 'bg-white shadow-md' : 'text-neutral-600'
          }`}
        >
          {tab.charAt(0).toUpperCase() + tab.slice(1)}
        </button>
      ))}
    </div>
  );
}
