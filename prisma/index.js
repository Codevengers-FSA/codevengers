const bcrypt = require("bcrypt");
const {PrismaClient} = new PrismaClient().$extends({
  model: {
    user: {
      async register(username, password) {
        const hash = await bcrypt.hash(password, 10);
        const user = await PrismaClient.user.create({
          data: {username, password: hash},
        });
        return user;
      },
      async login(username, password) {
        const user = await Prisma.user.findUniqueOrThrow({
          where: {username},
        });
        const valid = await bcrypt.compare(password, user.password);
        if(!valid) throw Error(" Invalid Password");
        return user
      },
    },
  },
});
module.exports = prisma;