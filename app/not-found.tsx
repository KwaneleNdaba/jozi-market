'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-32 text-center">
      <h2 className="text-4xl font-black text-jozi-forest">404 - Treasure Not Found</h2>
      <p className="text-gray-500 mt-4">We couldn&apos;t find the page you were looking for.</p>
      <Link href="/" className="inline-block mt-8 bg-jozi-forest text-white px-10 py-4 rounded-full font-bold">
        Back Home
      </Link>
    </div>
  );
}
