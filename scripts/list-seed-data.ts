import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function list(): Promise<void> {
  const disciplines = await prisma.discipline.findMany({
    orderBy: { displayOrder: 'asc' },
  });

  // eslint-disable-next-line no-console
  console.log('\nDisciplines in database:');
  disciplines.forEach((d) => {
    // eslint-disable-next-line no-console
    console.log(`  ${d.displayOrder}. ${d.name}`);
  });

  // eslint-disable-next-line no-console
  console.log('');

  await prisma.$disconnect();
}

// eslint-disable-next-line no-console
list().catch(console.error);
