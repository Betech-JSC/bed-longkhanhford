"use client";

import { useEffect, useState } from "react";
import { vehiclesAPI, bannersAPI, reviewsAPI } from "@/lib/api";
import { APIVehicle, APIBanner, APICustomerReview, APIResponse } from "@/types/api";

/**
 * Test page to verify API integration
 * Visit http://localhost:3000/test-api to see results
 */
export default function TestAPIPage() {
  const [vehicles, setVehicles] = useState<APIVehicle[]>([]);
  const [banners, setBanners] = useState<APIBanner[]>([]);
  const [reviews, setReviews] = useState<APICustomerReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        // Fetch vehicles
        const vehiclesResponse = await vehiclesAPI.getAll() as APIResponse<APIVehicle[]>;
        console.log("Vehicles API Response:", vehiclesResponse);
        setVehicles(vehiclesResponse.data || []);
        
        // Fetch banners
        const bannersResponse = await bannersAPI.getAll() as APIResponse<APIBanner[]>;
        console.log("Banners API Response:", bannersResponse);
        setBanners(bannersResponse.data || []);
        
        // Fetch reviews
        const reviewsResponse = await reviewsAPI.getAll() as APIResponse<APICustomerReview[]>;
        console.log("Reviews API Response:", reviewsResponse);
        setReviews(reviewsResponse.data || []);
        
        setLoading(false);
      } catch (err) {
        console.error("API Error:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading data from API...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-lg">
          <h2 className="text-red-800 font-bold text-lg mb-2">API Error</h2>
          <p className="text-red-600">{error}</p>
          <p className="text-sm text-gray-600 mt-4">
            Make sure the backend is running at http://localhost:8000
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">API Integration Test</h1>
        
        {/* Vehicles Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Vehicles ({vehicles.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((vehicle) => (
              <div key={vehicle.id} className="bg-white rounded-lg shadow-md p-6">
                <img
                  src={vehicle.image_url}
                  alt={vehicle.title}
                  className="w-full h-48 object-contain mb-4"
                />
                <h3 className="font-bold text-lg mb-2">{vehicle.title}</h3>
                <p className="text-gray-600 text-sm mb-2">{vehicle.tagline}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">{vehicle.type}</span>
                  <span className="font-bold text-blue-600">
                    {new Intl.NumberFormat('vi-VN').format(parseFloat(vehicle.base_price))}đ
                  </span>
                </div>
                {vehicle.is_best_seller && (
                  <span className="inline-block mt-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                    Best Seller
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Banners Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Banners ({banners.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {banners.map((banner) => (
              <div key={banner.id} className="bg-white rounded-lg shadow-md p-6">
                <img
                  src={banner.image_url}
                  alt={banner.title}
                  className="w-full h-32 object-cover rounded mb-4"
                />
                <h3 className="font-bold text-lg mb-2">{banner.title}</h3>
                {banner.description && (
                  <p className="text-gray-600 text-sm">{banner.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Reviews Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Customer Reviews ({reviews.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start mb-3">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                    {review.customer_name.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="ml-3">
                    <h4 className="font-bold text-gray-900">{review.customer_name}</h4>
                    {review.customer_role && (
                      <p className="text-sm text-gray-500">{review.customer_role}</p>
                    )}
                    <div className="flex mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Success Message */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-green-800 font-bold text-lg mb-2">✅ API Integration Successful!</h3>
          <p className="text-green-700">
            All API endpoints are working correctly. The frontend is successfully fetching data from the Laravel backend.
          </p>
          <ul className="mt-4 space-y-1 text-sm text-green-600">
            <li>✓ Vehicles API: {vehicles.length} vehicles loaded</li>
            <li>✓ Banners API: {banners.length} banners loaded</li>
            <li>✓ Reviews API: {reviews.length} reviews loaded</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
