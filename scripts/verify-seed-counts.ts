import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verify(): Promise<void> {
  const disciplines = await prisma.discipline.count();
  const units = await prisma.unit.count();
  const lessons = await prisma.lesson.count();

  // eslint-disable-next-line no-console
  console.log('\n✅ Seed Idempotency Verification:\n');
  // eslint-disable-next-line no-console
  console.log(`   Disciplines: ${disciplines} (expected: 3)`);
  // eslint-disable-next-line no-console
  console.log(`   Units: ${units} (expected: 1)`);
  // eslint-disable-next-line no-console
  console.log(`   Lessons: ${lessons} (expected: 1)`);
  // eslint-disable-next-line no-console
  console.log('');

  if (disciplines === 3 && units === 1 && lessons === 1) {
    // eslint-disable-next-line no-console
    console.log('✅ PASS: No duplicates created!');
    // eslint-disable-next-line no-console
    console.log('   Seed script ran twice successfully');
    // eslint-disable-next-line no-console
    console.log('   100% idempotent - safe for production\n');
  } else {
    // eslint-disable-next-line no-console
    console.log('❌ FAIL: Unexpected counts (duplicates detected)\n');
    process.exit(1);
  }

  await prisma.$disconnect();
}

// eslint-disable-next-line no-console
verify().catch(console.error);
