import { Suspense } from "react";
import HomeClient from "@/components/HomeClient";

function HomeFallback() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Translation Learning Assistant
        </h1>
        <p className="text-gray-500 max-w-xl mx-auto">
          Translate any text and discover the culture, history, and grammar behind
          every language. Powered by AI.
        </p>
      </div>
      <div className="animate-pulse space-y-5">
        <div className="card">
          <div className="h-24 bg-gray-100 rounded-xl" />
          <div className="flex gap-4 mt-4">
            <div className="h-12 w-48 bg-gray-100 rounded-xl" />
            <div className="h-12 w-48 bg-gray-100 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<HomeFallback />}>
      <HomeClient />
    </Suspense>
  );
}
