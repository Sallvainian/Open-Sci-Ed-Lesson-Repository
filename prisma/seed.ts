import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  // Seed disciplines
  const physicalScience = await prisma.discipline.create({
    data: {
      name: 'Physical Science',
      description: 'Study of matter, energy, and forces',
      displayOrder: 1,
    },
  });

  void (await prisma.discipline.create({
    data: {
      name: 'Life Science',
      description: 'Study of living organisms',
      displayOrder: 2,
    },
  }));

  void (await prisma.discipline.create({
    data: {
      name: 'Earth and Space Science',
      description: 'Study of Earth systems and space',
      displayOrder: 3,
    },
  }));

  // Seed sample unit
  const forcesUnit = await prisma.unit.create({
    data: {
      disciplineId: physicalScience.id,
      name: '8.1 Forces and Motion',
      description: 'Investigating contact and non-contact forces',
      displayOrder: 1,
      estimatedLessons: 12,
    },
  });

  // Seed sample lesson
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
  console.log('Database seeded successfully');
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
