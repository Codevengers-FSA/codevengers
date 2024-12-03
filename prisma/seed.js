// Import the PrismaClient
const { PrismaClient } = require(`@prisma/client`);

// Import the data for Phase 1 and Phase 2 movies
const phase1 = require(`./phases/phase1`);
const phase2 = require(`./phases/phase2`);
const phase3 = require(`./phases/phase3`);
const phase4 = require(`./phases/phase4`);
const phase5 = require(`./phases/phase4`)

// Initiate the Prisma client
const prisma = new PrismaClient();

// Main seeding function 
const main =  async () => {
  const movies = [
      // Combine the movie data from all phases into a single array with spread operator (`...`)
    ...Object.values(phase1),
    ...Object.values(phase2),
    ...Object.values(phase3),
    ...Object.values(phase4),
    ...Object.values(phase5),
  ];

  
  // Iterate over each movie in the array
  for (const movie of movies) {
    await prisma.movie.create({
      data: {
        title: movie.title,
        ratings: movie.ratings,
        summary: movie.summary,
        image: movie.image,
        watchlist: movie.watchlist,
      },
    });
  }
};

// Call the main function and handle success or failure
main()
  .then(() => {
    console.log(`Database seeded successfully!`);
    prisma.$disconnect();
  })
  .catch((error) => {
    console.error(`Error seeding the database:`, error);
    prisma.$disconnect();
    process.exit(1);
  });
