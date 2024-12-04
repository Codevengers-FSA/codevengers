// Import the PrismaClient
const prisma = require("../prisma");

// Import the data for Phase 1 and Phase 2 movies
const phase1 = require(`./phases/phase1`);
const phase2 = require(`./phases/phase2`);
const phase3 = require(`./phases/phase3`);
const phase4 = require(`./phases/phase4`);
const phase5 = require(`./phases/phase4`);




// Main seeding function 
const main =  async () => {
  const movies = [
      // Combine the movie data from all phases into a single array with spread operator (`...`)
      ...phase1,
      ...phase2,
      ...phase3,
      ...phase4,
      ...phase5,
  ];

  
  // Iterate over each movie in the array
  for (const movie of movies) {
    await prisma.movie.create({
      data: {
        title: movie.title,
        ratings: movie.ratings,
        summary: movie.summary,
        image: movie.image,
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
