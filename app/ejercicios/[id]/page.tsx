import { notFound } from "next/navigation"
import { ExerciseWorkspace } from "@/components/exercise-workspace"
import { getExercise } from "@/lib/exercise-content"

export default async function ExercisePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const exercise = getExercise(id)

  if (!exercise) notFound()

  return <ExerciseWorkspace exercise={exercise} />
}
