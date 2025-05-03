import { Link } from "react-router-dom";

function Contact() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex flex-col">
      {/* Gradient Overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-blue-50 to-transparent dark:from-blue-950 dark:to-transparent opacity-50 -z-10"></div>

      {/* Hero Section */}
      <section className="py-16 text-center relative">
        <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight relative z-10">
          Contact <span className="text-blue-600 dark:text-blue-400">Us</span>
        </h1>
        <p className="text-xl text-gray-800 dark:text-gray-100 max-w-3xl mx-auto mb-8 relative z-10">
          Have questions or feedback? Get in touch with the SynapShare team.
        </p>
      </section>

      {/* Contact Content */}
      <section className="grid grid-cols-1 gap-8 mb-auto">
        <div className="group relative flex flex-col p-8 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 hover:bg-blue-50 dark:hover:bg-blue-950 transition-all duration-300 shadow-lg hover:shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-t from-blue-200 to-transparent dark:from-blue-900 dark:to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-2xl"></div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            Email
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            Reach out to us directly at{" "}
            <a
              href="mailto:porwalkamlesh5@gmail.com"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              porwalkamlesh5@gmail.com
            </a>
            .
          </p>
        </div>

        <div className="group relative flex flex-col p-8 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 hover:bg-blue-50 dark:hover:bg-blue-950 transition-all duration-300 shadow-lg hover:shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-t from-blue-200 to-transparent dark:from-blue-900 dark:to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-2xl"></div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            Social Media
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            Connect with us on social platforms:
          </p>
          <div className="flex gap-3">
            <a
              href="https://www.linkedin.com/in/kamlesh-porwal-2b1a2a1a6/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              LinkedIn
            </a>
            <a
              href="https://github.com/kamleshp214"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              GitHub
            </a>
          </div>
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

export default Contact;
