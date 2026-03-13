// src/components/home/NewsletterSection.tsx
import { useState } from "react";
import toast from "react-hot-toast";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      toast.success("Successfully subscribed to newsletter!",{});
      setEmail("");
      setLoading(false);
    }, 1000);
  };

  return (
    <section className="py-16 bg-blue-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          Subscribe to Our Newsletter
        </h2>
        <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
          Get the latest updates on new arrivals, special offers, and exclusive
          discounts!
        </p>
        <form onSubmit={handleSubmit} className="max-w-md mx-auto flex gap-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="flex-1 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 disabled:opacity-50"
          >
            {loading ? "Subscribing..." : "Subscribe"}
          </button>
        </form>
      </div>
    </section>
  );
}
