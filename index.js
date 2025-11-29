// const { PrismaClient } = require("./generated/prisma"); 
const prisma = require("./lib/prisma.js"); 


// const prisma = new PrismaClient();

/** |Notes|
 * Mandatory Query => Mandatory queries require this command to run the code: 
 *                              $ node index.js 
 * 
 */

// You will create your Prisma Client queries here: 
async function main() {
    // await prisma.admin.create({
    //     data: {
    //         email: "ibenge908@gmail.com",
    //         isActive: false
    //     },
    // });
    // console.log("Admin seeded. Awaiting activation."); 

    // const email = await prisma.admin.findUnique({
    //     where: {
    //         email: "ibenge908@gmail.com"
    //     }
    // });

    const email = await prisma.admin.findMany({
        where: {
            email: "ibenge908@gmail.com"
        }
    })
    // console.log(email); // testing 
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1); 
    });