import { describe, it, expect, beforeEach } from 'vitest';
import { prisma } from './client';

describe('Database Client', () => {
  beforeEach(async () => {
    // Clean database before each test
    await prisma.lesson.deleteMany();
    await prisma.unit.deleteMany();
    await prisma.discipline.deleteMany();
  });

  it('should connect to database successfully', async () => {
    const result = await prisma.$queryRaw<Array<{ result: number }>>`SELECT 1 as result`;
    expect(result).toBeDefined();
    expect(result[0].result).toBe(1);
  });

  it('should create discipline with CRUD operations', async () => {
    // Create
    const discipline = await prisma.discipline.create({
      data: {
        name: 'Test Science',
        description: 'Test description',
        displayOrder: 1,
      },
    });

    expect(discipline.id).toBeDefined();
    expect(discipline.name).toBe('Test Science');
    expect(discipline.createdAt).toBeInstanceOf(Date);
    expect(discipline.updatedAt).toBeInstanceOf(Date);

    // Read
    const found = await prisma.discipline.findUnique({
      where: { id: discipline.id },
    });
    expect(found).toBeDefined();
    expect(found?.name).toBe('Test Science');

    // Update
    const updated = await prisma.discipline.update({
      where: { id: discipline.id },
      data: { description: 'Updated description' },
    });
    expect(updated.description).toBe('Updated description');

    // Delete
    await prisma.discipline.delete({
      where: { id: discipline.id },
    });
    const deleted = await prisma.discipline.findUnique({
      where: { id: discipline.id },
    });
    expect(deleted).toBeNull();
  });

  it('should create unit with discipline relationship', async () => {
    const discipline = await prisma.discipline.create({
      data: {
        name: 'Physical Science',
        displayOrder: 1,
      },
    });

    const unit = await prisma.unit.create({
      data: {
        disciplineId: discipline.id,
        name: 'Forces and Motion',
        displayOrder: 1,
        estimatedLessons: 10,
      },
    });

    expect(unit.id).toBeDefined();
    expect(unit.disciplineId).toBe(discipline.id);

    // Verify relationship
    const unitWithDiscipline = await prisma.unit.findUnique({
      where: { id: unit.id },
      include: { discipline: true },
    });
    expect(unitWithDiscipline?.discipline.name).toBe('Physical Science');
  });

  it('should create lesson with unit relationship and arrays', async () => {
    const discipline = await prisma.discipline.create({
      data: { name: 'Test', displayOrder: 1 },
    });

    const unit = await prisma.unit.create({
      data: {
        disciplineId: discipline.id,
        name: 'Test Unit',
        displayOrder: 1,
        estimatedLessons: 5,
      },
    });

    const lesson = await prisma.lesson.create({
      data: {
        unitId: unit.id,
        name: 'Test Lesson',
        lessonNumber: 1,
        displayOrder: 1,
        status: 'upcoming',
        standards: ['MS-PS2-1', 'MS-PS2-2'],
        objectives: ['Objective 1', 'Objective 2'],
        studentTargets: ['Target 1', 'Target 2'],
        teachingApproach: 'Test approach',
      },
    });

    expect(lesson.id).toBeDefined();
    expect(lesson.standards).toEqual(['MS-PS2-1', 'MS-PS2-2']);
    expect(lesson.objectives).toHaveLength(2);
    expect(lesson.status).toBe('upcoming');
  });

  it('should enforce cascade delete from discipline to units', async () => {
    const discipline = await prisma.discipline.create({
      data: { name: 'Test', displayOrder: 1 },
    });

    const unit = await prisma.unit.create({
      data: {
        disciplineId: discipline.id,
        name: 'Test Unit',
        displayOrder: 1,
        estimatedLessons: 5,
      },
    });

    // Delete discipline should cascade to unit
    await prisma.discipline.delete({
      where: { id: discipline.id },
    });

    const deletedUnit = await prisma.unit.findUnique({
      where: { id: unit.id },
    });
    expect(deletedUnit).toBeNull();
  });

  it('should enforce cascade delete from unit to lessons', async () => {
    const discipline = await prisma.discipline.create({
      data: { name: 'Test', displayOrder: 1 },
    });

    const unit = await prisma.unit.create({
      data: {
        disciplineId: discipline.id,
        name: 'Test Unit',
        displayOrder: 1,
        estimatedLessons: 5,
      },
    });

    const lesson = await prisma.lesson.create({
      data: {
        unitId: unit.id,
        name: 'Test Lesson',
        lessonNumber: 1,
        displayOrder: 1,
        status: 'upcoming',
        standards: [],
        objectives: [],
        studentTargets: [],
        teachingApproach: 'Test',
      },
    });

    // Delete unit should cascade to lesson
    await prisma.unit.delete({
      where: { id: unit.id },
    });

    const deletedLesson = await prisma.lesson.findUnique({
      where: { id: lesson.id },
    });
    expect(deletedLesson).toBeNull();
  });
});
