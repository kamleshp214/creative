import { Link } from "react-router-dom";

function Privacy() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex flex-col">
      {/* Gradient Overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-blue-50 to-transparent dark:from-blue-950 dark:to-transparent opacity-50 -z-10"></div>

      {/* Hero Section */}
      <section className="py-16 text-center relative">
        <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight relative z-10">
          Privacy{" "}
          <span className="text-blue-600 dark:text-blue-400">Policy</span>
        </h1>
        <p className="text-xl text-gray-800 dark:text-gray-100 max-w-3xl mx-auto mb-8 relative z-10">
          Understand how SynapShare protects your data and privacy.
        </p>
      </section>

      {/* Privacy Policy Content */}
      <section className="grid grid-cols-1 gap-8 mb-auto">
        <div className="group relative flex flex-col p-8 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 hover:bg-blue-50 dark:hover:bg-blue-950 transition-all duration-300 shadow-lg hover:shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-t from-blue-200 to-transparent dark:from-blue-900 dark:to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-2xl"></div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            Introduction
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            At SynapShare, we value your privacy. This policy outlines how we
            collect, use, and protect your personal information when you use our
            platform.
          </p>
        </div>

        <div className="group relative flex flex-col p-8 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 hover:bg-blue-50 dark:hover:bg-blue-950 transition-all duration-300 shadow-lg hover:shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-t from-blue-200 to-transparent dark:from-blue-900 dark:to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-2xl"></div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            Data Collection
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            We collect data you provide, such as your email, username, and
            content (notes, discussions, nodes). We also gather usage data like
            IP addresses to improve our services.
          </p>
        </div>

        <div className="group relative flex flex-col p-8 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 hover:bg-blue-50 dark:hover:bg-blue-950 transition-all duration-300 shadow-lg hover:shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-t from-blue-200 to-transparent dark:from-blue-900 dark:to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-2xl"></div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            Data Usage
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Your data helps us personalize your experience, moderate content,
            and ensure platform security. We do not sell your information to
            third parties.
          </p>
        </div>

        <div className="group relative flex flex-col p-8 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 hover:bg-blue-50 dark:hover:bg-blue-950 transition-all duration-300 shadow-lg hover:shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-t from-blue-200 to-transparent dark:from-blue-900 dark:to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-2xl"></div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            Contact Us
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            For questions about this Privacy Policy, please reach out to{" "}
            <a
              href="mailto:porwalkamlesh5@gmail.com"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              porwalkamlesh5@gmail.com
            </a>
            .
          </p>
        </div>

        <div className="text-center">
          <Link
            to="/"
            className="inline-block bg-blue-600 dark:bg-blue-500 text-white font-semibold py-3 px-8 rounded-full hover:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-300 shadow-md relative z-10"
          >
            Back to Home
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Privacy;
