const prisma = require("../prisma");

const phase1 = require("./phases/phase1");
const phase2 = require("./phases/phase2");
const phase3 = require("./phases/phase3");
const phase4 = require("./phases/phase4");
const phase5 = require("./phases/phase5");

const main = async () => {
  const movies = [
    ...phase1,
    ...phase2,
    ...phase3,
    ...phase4,
    ...phase5,
  ];

  for (const movie of movies) {
    await prisma.movie.upsert({
      where: {
        title: movie.title,
      },
      update: {
        summary: movie.summary,
        image: movie.image,
        releaseDate: movie.releaseDate,
        chronologicalOrder: movie.chronologicalOrder,
      },
      create: {
        title: movie.title,
        summary: movie.summary,
        image: movie.image,
        releaseDate: movie.releaseDate,
        chronologicalOrder: movie.chronologicalOrder,
      },
    });
  }
};

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