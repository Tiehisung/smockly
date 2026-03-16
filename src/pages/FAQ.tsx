// src/pages/FAQ.tsx
import { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  {
    category: "Orders",
    question: "How do I place an order?",
    answer:
      'Simply browse our collection, select the items you want, choose your size and color, and click "Add to Cart". When you\'re ready, proceed to checkout and follow the steps to complete your purchase.',
  },
  {
    category: "Orders",
    question: "Can I modify or cancel my order?",
    answer:
      "Orders can be modified or cancelled within 1 hour of placing them. Please contact our customer service immediately if you need to make changes.",
  },
  {
    category: "Shipping",
    question: "How long does shipping take?",
    answer:
      "Standard shipping takes 3-5 business days within the US. International shipping can take 7-14 business days depending on the destination.",
  },
  {
    category: "Shipping",
    question: "Do you offer free shipping?",
    answer:
      "Yes! We offer free standard shipping on all orders over $100 within the continental US.",
  },
  {
    category: "Returns",
    question: "What is your return policy?",
    answer:
      "We accept returns within 30 days of delivery. Items must be unworn, unwashed, and in original condition with tags attached.",
  },
  {
    category: "Returns",
    question: "How do I initiate a return?",
    answer:
      "Log into your account, go to your orders, select the item you want to return, and follow the return instructions. You'll receive a return shipping label via email.",
  },
  {
    category: "Products",
    question: "How do I find my size?",
    answer:
      "Check our size guide on each product page. We provide detailed measurements for each size to help you find the perfect fit.",
  },
  {
    category: "Products",
    question: "Are your smocks authentic?",
    answer:
      "Yes! All our smocks are handcrafted by skilled artisans using traditional techniques and authentic materials.",
  },
];

export function FAQPage() {
  const [openItems, setOpenItems] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = ["all", ...new Set(faqs.map((faq) => faq.category))];

  const toggleItem = (index: number) => {
    setOpenItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  const filteredFaqs =
    selectedCategory === "all"
      ? faqs
      : faqs.filter((faq) => faq.category === selectedCategory);

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about our products, shipping,
            returns, and more.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-lg border border-gray-200 p-1">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  selectedCategory === category
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto">
          {filteredFaqs.map((faq, index) => (
            <div key={index} className="border-b border-gray-200 last:border-0">
              <button
                onClick={() => toggleItem(index)}
                className="w-full py-6 flex items-center justify-between text-left hover:text-blue-600"
              >
                <span className="text-lg font-medium text-gray-900">
                  {faq.question}
                </span>
                <ChevronDownIcon
                  className={`h-5 w-5 text-gray-500 transition-transform ${
                    openItems.includes(index) ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openItems.includes(index) && (
                <div className="pb-6">
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Still Have Questions */}
        <div className="mt-12 text-center bg-gray-50 rounded-lg p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Still Have Questions?
          </h2>
          <p className="text-gray-600 mb-4">
            Can't find the answer you're looking for? Please contact our support
            team.
          </p>
          <a
            href="/contact"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
}
