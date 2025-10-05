-- CreateEnum
CREATE TYPE "LessonStatus" AS ENUM ('upcoming', 'in_progress', 'completed', 'needs_review');

-- CreateTable
CREATE TABLE "disciplines" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "disciplines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "units" (
    "id" TEXT NOT NULL,
    "discipline_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "estimated_lessons" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "units_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lessons" (
    "id" TEXT NOT NULL,
    "unit_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "lesson_number" INTEGER NOT NULL,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "scheduled_date" TIMESTAMP(3),
    "completed_date" TIMESTAMP(3),
    "status" "LessonStatus" NOT NULL DEFAULT 'upcoming',
    "standards" TEXT[],
    "objectives" TEXT[],
    "student_targets" TEXT[],
    "teaching_approach" TEXT NOT NULL,
    "teacher_notes" TEXT,
    "estimated_duration" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lessons_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "disciplines_name_key" ON "disciplines"("name");

-- CreateIndex
CREATE INDEX "units_discipline_id_idx" ON "units"("discipline_id");

-- CreateIndex
CREATE INDEX "lessons_unit_id_idx" ON "lessons"("unit_id");

-- CreateIndex
CREATE INDEX "lessons_scheduled_date_idx" ON "lessons"("scheduled_date");

-- CreateIndex
CREATE INDEX "lessons_status_idx" ON "lessons"("status");

-- AddForeignKey
ALTER TABLE "units" ADD CONSTRAINT "units_discipline_id_fkey" FOREIGN KEY ("discipline_id") REFERENCES "disciplines"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "units"("id") ON DELETE CASCADE ON UPDATE CASCADE;
