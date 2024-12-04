const prisma = require("../prisma");
const { faker } = require ("@faker-js/faker");

const main = async (numUsers = 25)=>{
    
    const users = Array.from({ length: numUsers}, ()=>({
        username: faker.internet.username(),
        password: faker.internet.password(6),
    }))
     await prisma.user.createMany({ data: users });
};

main()
.then(async ()=>{ await prisma.$disconnect()})
.catch(async (e)=>{
    console.error(e);
    await prisma.$disconnect();
    process.exit(1)
});


