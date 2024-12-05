const express = require("express");
const router = express.Router();

const userSeed = require("../prisma/seedUser");

router.get("/", async (req, res, next) =>{
    try {
        const users = await prisma.user.findMany();
        res.json(users);
    } catch (e) {
        next (e)
    }
});

router.get("/:id", async (req, res, next)=>{
    const { id } = req.params;
    try{
        const user = await prisma.user.findUniqueOrThrow({
            where: { id: +id},
        });
        res.json(user);
    } catch (e){
        next (e);
    }
});

module.exports = router;