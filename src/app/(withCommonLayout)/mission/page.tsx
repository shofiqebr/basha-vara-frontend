"use client";

const missions = [
  {
    id: "1",
    title: "Our Vision for Affordable Housing",
    description:
      "We aim to provide affordable, high-quality housing solutions to all residents in Dhaka.",
    createdAt: "2025-04-01",
  },
  {
    id: "2",
    title: "Empowering Tenants with Knowledge",
    description:
      "We provide tenants with valuable information on how to navigate the rental market effectively.",
    createdAt: "2025-04-10",
  },
  {
    id: "3",
    title: "Building a Trustworthy Community",
    description:
      "We strive to foster a community of landlords and tenants who can trust each other and build lasting relationships.",
    createdAt: "2025-04-15",
  },
  {
    id: "4",
    title: "Improving Rental Experiences for All",
    description:
      "Our mission is to enhance the rental process, making it smooth and transparent for both landlords and tenants.",
    createdAt: "2025-04-20",
  },
];

const MissionPage = () => {
  return (
    <div className=" mx-auto px-8 py-10">
      <h1 className="text-3xl font-bold text-[#D97706] mb-8">Our Mission</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {missions.map((mission) => (
          <div
            key={mission.id}
            className="bg-[#1F2937] text-white p-6 rounded-lg shadow hover:shadow-lg transition duration-300 border hover:-translate-y-0.5 "
          >
            <h2 className="text-xl font-semibold text-[#FBBF24] mb-2">
              {mission.title}
            </h2>
            <p className="text-gray-300">{mission.description}</p>
            <p className="text-sm text-gray-400 mt-2">
              Published: {new Date(mission.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MissionPage;
