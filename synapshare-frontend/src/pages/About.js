import { Link } from "react-router-dom";

function About() {
  const handleClick = (label) => {
    console.log(`${label} clicked`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex flex-col">
      {/* Background Overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-blue-50 to-transparent dark:from-blue-950 dark:to-transparent opacity-50 -z-10"></div>

      {/* Header Section */}
      <section className="py-16 text-center relative">
        <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
          About{" "}
          <span className="text-blue-600 dark:text-blue-400">SynapShare</span>
        </h1>
        <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto mb-8">
          Learn about our mission, our creator, and how SynapShare connects
          students through knowledge.
        </p>
      </section>

      {/* Cards Section */}
      <section className="grid grid-cols-1 gap-8 mb-auto">
        {/* Mission Card */}
        <div className="group p-8 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-lg hover:shadow-2xl transition">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            Our Mission
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            SynapShare is a community-driven platform to help students share
            notes, stay updated, and build networks through collaborative
            learning.
          </p>
        </div>

        {/* Creator Card */}
        <div className="group p-8 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-lg hover:shadow-2xl transition">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            Meet the Creator
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            Kamlesh Porwal, a passionate Computer Science student from MIT
            Ujjain, built SynapShare with a vision of tech-enabled education.
          </p>
          <div className="flex flex-wrap gap-3 mt-2">
            <a
              href="mailto:porwalkamlesh5@gmail.com"
              onClick={() => handleClick("Email")}
              className="bg-blue-600 text-white text-sm font-medium py-2 px-4 rounded-full hover:bg-blue-700 transition"
            >
              Email
            </a>
            <a
              href="https://www.linkedin.com/in/kamlesh-porwal-2b1a2a1a6/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleClick("LinkedIn")}
              className="bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-full hover:bg-blue-800 transition"
            >
              LinkedIn
            </a>
            <a
              href="https://github.com/kamleshp214"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleClick("GitHub")}
              className="bg-gray-900 text-white text-sm font-medium py-2 px-4 rounded-full hover:bg-black transition"
            >
              GitHub
            </a>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-8">
          <Link
            to="/login"
            onClick={() => handleClick("Join")}
            className="inline-block bg-blue-600 text-white font-semibold py-3 px-8 rounded-full hover:bg-blue-700 transition shadow"
          >
            Join the Community
          </Link>
        </div>
      </section>
    </div>
  );
}

export default About;
