// data/dummyData.ts
export const dashboardStats = [
  { title: "Total Booking", count: 120, subtitle: "Total booking terdaftar" },
  { title: "Pending Verification", count: 15, subtitle: "Menunggu verifikasi pembayaran" },
  { title: "On Progress", count: 8, subtitle: "Sedang proses grooming" },
  { title: "Completed", count: 97, subtitle: "Grooming selesai" },
];

export const recentBookings = [
  { id:1, pet: "Luna", owner: "Budi Santoso", package: "Grooming Standard", date: "28 Mei 2026", time: "10:00", status: "Pending" },
  { id:2, pet: "Milo", owner: "Siti Nurlaila", package: "Grooming Premium", date: "28 Mei 2026", time: "13:00", status: "On Progress" },
  { id:3, pet: "Coco", owner: "Andi Wijaya", package: "Grooming Lite", date: "28 Mei 2026", time: "15:00", status: "Done" },
];

export const dummyPackages = [
  { id: 1, name: "Grooming Standard", price: 100000, description: "Basic grooming package" },
  { id: 2, name: "Grooming Premium", price: 150000, description: "Premium package with bath + haircut" },
  { id: 3, name: "Grooming Lite", price: 75000, description: "Lite grooming for small pets" },
];

export const dummyBookings = [
  { id: 1, pet: "Luna", owner: "Budi Santoso", package: "Grooming Standard", date: "28 Mei 2026", time: "10:00", status: "Paid" },
  { id: 2, pet: "Milo", owner: "Siti Nurlaila", package: "Grooming Premium", date: "28 Mei 2026", time: "13:00", status: "On Progress" },
  { id: 3, pet: "Coco", owner: "Andi Wijaya", package: "Grooming Lite", date: "28 Mei 2026", time: "15:00", status: "Completed" },
];

export const dummyCustomers = [
  { id: 1, username: "BudiSantoso", email: "budi@mail.com", role: "CUSTOMER", pet: "Luna" },
  { id: 2, username: "SitiNurlaila", email: "siti@mail.com", role: "CUSTOMER", pet: "Milo" },
  { id: 3, username: "AndiWijaya", email: "andi@mail.com", role: "CUSTOMER", pet: "Coco" },
];

export const dummyAdminProfile = {
  id: 1,
  username: "AdminMeiLody",
  email: "admin@meilody.com",
  phone: "08123456789",
  bio: "Admin Pet Grooming Management",
  photo: "/default-avatar.png",
  bookings: [
    { id: 1, pet: "Luna", package: "Grooming Standard", date: "28 Mei 2026", status: "Paid" },
    { id: 2, pet: "Milo", package: "Grooming Premium", date: "29 Mei 2026", status: "On Progress" },
  ],
};

export const teamMembers = [
  {
    id: 1,
    name: "Loi Lieant",
    role: "Front End Developer",
    desc: "Bertanggung jawab membangun antarmuka yang responsif, interaktif, dan user-friendly menggunakan teknologi modern.",
    img: "PhotoTeam/loi.png", // link contoh foto
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "React"],
    socials: {
      github: "https://github.com/loi",
      linkedin: "https://linkedin.com/in/loi",
      mail: "mailto:loi@example.com"
    }
  },
  {
    id: 2,
    name: "Meilan",
    role: "Back End Developer",
    desc: "Berfokus pada pengembangan server-side, API, dan manajemen database untuk memastikan performa dan keamanan sistem.",
    img: "PhotoTeam/meilan.png", // link contoh foto
    techStack: ["Node.js", "Express.js", "MongoDB", "Prisma"],
    socials: {
      github: "https://github.com/meilan",
      linkedin: "https://linkedin.com/in/meilan",
      mail: "mailto:meilan@example.com"
    }
  }
];