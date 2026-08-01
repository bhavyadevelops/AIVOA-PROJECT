import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900">404</h1>
        <p className="mt-2 text-gray-600">Page not found</p>
        <Link href="/" className="mt-4 inline-block text-blue-600 hover:underline">
          Go back home
        </Link>
      </div>
    </div>
  );
}
