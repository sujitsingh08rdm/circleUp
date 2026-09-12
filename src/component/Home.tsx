import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="animate__animated animate__fadeIn min-h-screen bg-slate-50 text-slate-800">
      {/* Hero Section */}
      <section className="min-h-[75vh] flex flex-col items-center justify-center text-center px-6 py-20">
        <div className="max-w-4xl">
          <span className="inline-block mb-5 px-4 py-2 rounded-full bg-indigo-100 text-indigo-600 text-sm font-semibold">
            Connect • Chat • Share
          </span>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-linear-to-br from-[#3D4E81] via-[#5753C9] to-[#6E7FF3] bg-clip-text text-transparent">
            Welcome to Besties
          </h1>

          <p className="text-lg md:text-xl max-w-2xl mx-auto text-slate-500 mb-10 leading-relaxed">
            Connect, chat, and share moments with your best friends — wherever
            they are.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/login">
              <button className="w-full sm:w-auto px-8 py-3 rounded-xl text-white font-semibold shadow-lg bg-linear-to-br from-[#3D4E81] via-[#5753C9] to-[#6E7FF3] hover:opacity-90 transition">
                Login
              </button>
            </Link>

            <Link to="/signup">
              <button className="w-full sm:w-auto px-8 py-3 rounded-xl bg-white border border-indigo-200 text-indigo-600 font-semibold shadow-sm hover:bg-indigo-50 transition">
                Sign Up
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 bg-linear-to-br from-[#3D4E81] via-[#5753C9] to-[#6E7FF3]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-white">
            Features You'll Love
          </h2>

          <p className="text-center text-indigo-100 max-w-2xl mx-auto mb-12">
            Everything you need to stay connected with the people who matter
            most.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Chat */}
            <div className="rounded-2xl p-8 bg-white/10 backdrop-blur-sm border border-white/10 shadow-xl hover:-translate-y-1 transition">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-white/15 mb-6">
                <i className="ri-message-3-fill text-2xl text-white"></i>
              </div>

              <h3 className="text-xl font-bold text-white mb-3">
                Real-time Chat
              </h3>

              <p className="text-indigo-100 leading-relaxed">
                Stay connected with instant messaging and emoji support.
              </p>
            </div>

            {/* Video */}
            <div className="rounded-2xl p-8 bg-white/10 backdrop-blur-sm border border-white/10 shadow-xl hover:-translate-y-1 transition">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-white/15 mb-6">
                <i className="ri-video-chat-fill text-2xl text-white"></i>
              </div>

              <h3 className="text-xl font-bold text-white mb-3">Video Calls</h3>

              <p className="text-indigo-100 leading-relaxed">
                Talk face-to-face with smooth, high-quality video calls.
              </p>
            </div>

            {/* Audio */}
            <div className="rounded-2xl p-8 bg-white/10 backdrop-blur-sm border border-white/10 shadow-xl hover:-translate-y-1 transition">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-white/15 mb-6">
                <i className="ri-phone-fill text-2xl text-white"></i>
              </div>

              <h3 className="text-xl font-bold text-white mb-3">Audio Calls</h3>

              <p className="text-indigo-100 leading-relaxed">
                Enjoy crystal-clear voice chats anywhere, anytime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Advantages Section */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 bg-linear-to-br from-[#3D4E81] via-[#5753C9] to-[#6E7FF3] bg-clip-text text-transparent">
            Why Social Networking?
          </h2>

          <p className="text-center text-slate-500 max-w-2xl mx-auto mb-12">
            Build meaningful connections and make staying in touch easier.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              "Stay connected with friends and family across the globe",
              "Build communities around your interests",
              "Improve communication skills and confidence",
              "Stay updated with real-time events and news",
              "Collaborate and share memories seamlessly",
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-100 transition"
              >
                <div className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-indigo-100 text-indigo-600">
                  <i className="ri-check-line text-xl"></i>
                </div>

                <p className="text-slate-600">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-6 py-20 bg-linear-to-br from-[#3D4E81] via-[#5753C9] to-[#6E7FF3] text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-5">
          Ready to connect with your besties?
        </h2>

        <p className="text-indigo-100 mb-8 max-w-xl mx-auto">
          Join Besties and start chatting, calling, and sharing moments today.
        </p>

        <Link to="/signup">
          <button className="px-8 py-3 rounded-xl bg-white text-indigo-600 font-semibold shadow-lg hover:bg-indigo-50 transition">
            Get Started
          </button>
        </Link>
      </section>
    </div>
  );
};

export default Home;
