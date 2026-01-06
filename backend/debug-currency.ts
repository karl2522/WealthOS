import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- Debugging Portfolios ---');
    const portfolios = await prisma.portfolio.findMany({
        include: {
            user: {
                select: { email: true }
            }
        }
    });

    if (portfolios.length === 0) {
        console.log('No portfolios found.');
    } else {
        portfolios.forEach(p => {
            console.log(`Portfolio ID: ${p.id}`);
            console.log(`  Name: ${p.name}`);
            console.log(`  Currency: ${p.currency}`); // This is what we need to check
            console.log(`  User: ${p.user.email}`);
            console.log('---');
        });
    }
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
