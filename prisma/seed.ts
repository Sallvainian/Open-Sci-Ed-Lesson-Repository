import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  // Seed disciplines (using upsert - leverages unique constraint on name)
  const physicalScience = await prisma.discipline.upsert({
    where: { name: 'Physical Science' },
    update: {}, // Don't modify if exists
    create: {
      name: 'Physical Science',
      description: 'Study of matter, energy, and forces',
      displayOrder: 1,
    },
  });
  // eslint-disable-next-line no-console
  console.log('✓ Discipline: Physical Science');

  await prisma.discipline.upsert({
    where: { name: 'Life Science' },
    update: {},
    create: {
      name: 'Life Science',
      description: 'Study of living organisms',
      displayOrder: 2,
    },
  });
  // eslint-disable-next-line no-console
  console.log('✓ Discipline: Life Science');

  await prisma.discipline.upsert({
    where: { name: 'Earth and Space Science' },
    update: {},
    create: {
      name: 'Earth and Space Science',
      description: 'Study of Earth systems and space',
      displayOrder: 3,
    },
  });
  // eslint-disable-next-line no-console
  console.log('✓ Discipline: Earth and Space Science');

  // Seed sample unit (check existence before creating)
  let forcesUnit = await prisma.unit.findFirst({
    where: {
      disciplineId: physicalScience.id,
      name: '8.1 Forces and Motion',
    },
  });

  if (!forcesUnit) {
    forcesUnit = await prisma.unit.create({
      data: {
        disciplineId: physicalScience.id,
        name: '8.1 Forces and Motion',
        description: 'Investigating contact and non-contact forces',
        displayOrder: 1,
        estimatedLessons: 12,
      },
    });
    // eslint-disable-next-line no-console
    console.log('✓ Unit: 8.1 Forces and Motion (created)');
  } else {
    // eslint-disable-next-line no-console
    console.log('✓ Unit: 8.1 Forces and Motion (already exists)');
  }

  // Seed sample lesson (check existence before creating)
  const existingLesson = await prisma.lesson.findFirst({
    where: {
      unitId: forcesUnit.id,
      lessonNumber: 1,
    },
  });

  if (!existingLesson) {
    await prisma.lesson.create({
      data: {
        unitId: forcesUnit.id,
        name: 'Lesson 1: Investigating Contact Forces',
        lessonNumber: 1,
        displayOrder: 1,
        status: 'upcoming',
        standards: ['MS-PS2-1', 'MS-PS2-2'],
        objectives: ['Understand types of contact forces', 'Measure force magnitude and direction'],
        studentTargets: [
          'We are learning to identify contact forces in everyday situations',
          'We are learning to measure forces using appropriate tools',
        ],
        teachingApproach: 'Students will conduct hands-on experiments...',
        estimatedDuration: 50,
      },
    });
    // eslint-disable-next-line no-console
    console.log('✓ Lesson: Lesson 1 (created)');
  } else {
    // eslint-disable-next-line no-console
    console.log('✓ Lesson: Lesson 1 (already exists)');
  }

  // eslint-disable-next-line no-console
  console.log('\nDatabase seeded successfully');
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
