const ExtraSections = () => {
    return (
      <section className="bg-[#1F2937] text-white py-16 px-6">
        <div className="container mx-auto">
          {/* Testimonials Section */}
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold text-[#D97706] mb-6">Success Stories</h2>
            <p className="text-lg text-gray-300 mb-12">
              Hear from our users who found their dream rentals with BashaFinder.
            </p>
  
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: "Rahim Ahmed", text: "Found the perfect apartment in just two days. Amazing experience!" },
                { name: "Sara Jahan", text: "BashaFinder made my house search stress-free and smooth." },
                { name: "Arman Hossain", text: "Highly recommended! The listings are accurate and reliable." },
              ].map((testimonial, index) => (
                <div key={index} className="bg-[#111827] p-6 rounded-lg shadow-lg border border-gray-600">
                  <p className="text-gray-300 italic">"{testimonial.text}"</p>
                  <h3 className="text-xl font-semibold text-[#D97706] mt-4">{testimonial.name}</h3>
                </div>
              ))}
            </div>
          </div>
  
          {/* Tips Section */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-[#D97706] mb-6">Rental Tips & Advice</h2>
            <p className="text-lg text-gray-300 mb-12">
              Follow these expert tips to make your rental search successful.
            </p>
  
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: "Check the Neighborhood", text: "Visit the area at different times of the day to get a feel for the surroundings." },
                { title: "Understand the Lease Terms", text: "Read the contract carefully and clarify any doubts before signing." },
                { title: "Compare Listings", text: "Don't rush! Compare multiple listings to find the best value for your budget." },
              ].map((tip, index) => (
                <div key={index} className="bg-[#111827] p-6 rounded-lg shadow-lg border border-gray-600">
                  <h3 className="text-xl font-semibold text-[#D97706] mb-3">{tip.title}</h3>
                  <p className="text-gray-300">{tip.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  };
  
  export default ExtraSections;
  