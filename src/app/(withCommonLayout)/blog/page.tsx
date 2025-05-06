"use client";

const blogs = [
  {
    id: "1",
    title: "How to Find the Perfect Rental in Dhaka",
    summary:
      "Finding a good rental in Dhaka takes effort. Learn how to research, budget, and negotiate better.",
    createdAt: "2024-11-01",
  },
  {
    id: "2",
    title: "Top 5 Mistakes Tenants Make & How to Avoid Them",
    summary:
      "From not reading the contract to ignoring the inspection, these are the mistakes you should avoid.",
    createdAt: "2024-12-10",
  },
  {
    id: "3",
    title: "Landlord Tips: Make Your Property More Attractive",
    summary:
      "Want more rental requests? These small upgrades can significantly boost your property’s appeal.",
    createdAt: "2025-01-15",
  },
  {
    id: "4",
    title: "What to Check Before Signing a Rental Agreement",
    summary:
      "Before committing, verify documents, utility access, and house conditions with this quick checklist.",
    createdAt: "2025-02-01",
  },
  {
    id: "5",
    title: "Tips for Freelancers Searching for Rentals",
    summary:
      "Freelancers often face rental challenges. Here's how to strengthen your application and build trust.",
    createdAt: "2025-03-05",
  },
  {
    id: "6",
    title: "Save Money While Renting: Practical Tips",
    summary:
      "Cut down costs without compromising your comfort. Smart budgeting tips every renter should know.",
    createdAt: "2025-03-28",
  },
];

const BlogPage = () => {
  return (
    <div className=" mx-auto px-8 py-10 ">
      <h1 className="text-3xl font-bold text-[#D97706] mb-8">Rental Tips & Blog</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {blogs.map((blog) => (
          <div
            key={blog.id}
            className="bg-[#1F2937] text-white p-6 rounded-lg shadow hover:shadow-lg transition duration-300 border hover:-translate-y-0.5 "
          >
            <h2 className="text-xl font-semibold text-[#FBBF24] mb-2">
              {blog.title}
            </h2>
            <p className="text-gray-300">{blog.summary}</p>
            <button className="mt-4 text-[#D97706] hover:underline">
              Read more →
            </button>
            <p className="text-sm text-gray-400 mt-2">
              Published: {new Date(blog.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogPage;
