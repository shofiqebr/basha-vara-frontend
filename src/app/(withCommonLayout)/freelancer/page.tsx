"use client";

const FreelancerPage = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10 text-white">
      <h1 className="text-4xl font-bold text-[#D97706] mb-6">
        Become a BashaFinder Freelancer 🏠💼
      </h1>

      <p className="text-gray-300 mb-6">
        Want to earn from home without investment? Join our Freelancer Program and help people find rental houses. All you need is a mobile phone and some local connections!
      </p>

      {/* Process */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-[#FBBF24] mb-4">📌 How It Works</h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2">
          <li>Sign up as a freelancer through our platform.</li>
          <li>Look for vacant houses in your area or via online groups.</li>
          <li>Collect basic info (location, rent, photos, contact number).</li>
          <li>Submit the listing using our simple submission form.</li>
          <li>Earn commission when a tenant confirms a deal through your listing!</li>
        </ul>
      </section>

      {/* Benefits */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-[#FBBF24] mb-4">🎉 Benefits</h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2">
          <li>Flexible work — earn anytime, from anywhere.</li>
          <li>Instant mobile payment after successful deals.</li>
          <li>No investment or experience required.</li>
          <li>Work as part-time, full-time or on weekends only.</li>
        </ul>
      </section>

      {/* Opportunities */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-[#FBBF24] mb-4">🚀 Opportunities</h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2">
          <li>Earn up to ৳500–1000 per successful listing.</li>
          <li>Get badges and higher commissions as a top freelancer.</li>
          <li>Referral bonuses for bringing new freelancers onboard.</li>
        </ul>
      </section>

      {/* Facilities */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-[#FBBF24] mb-4">💼 Facilities</h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2">
          <li>Dedicated dashboard to track your submissions and earnings.</li>
          <li>24/7 support via WhatsApp or Messenger.</li>
          <li>Training materials and video guides for new freelancers.</li>
        </ul>
      </section>

      <div className="bg-[#1F2937] p-6 rounded-lg mt-6">
        <h3 className="text-xl font-semibold text-[#D97706] mb-2">Ready to Join?</h3>
        <p className="text-gray-300 mb-4">
          Click below to register as a freelancer and start earning from today!
        </p>
        <button className="bg-[#D97706] hover:bg-[#b26504] text-white px-5 py-2 rounded transition">
          Join as Freelancer
        </button>
      </div>
    </div>
  );
};

export default FreelancerPage;
