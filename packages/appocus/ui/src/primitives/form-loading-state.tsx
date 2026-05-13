import { Skeleton } from "./skeleton.js";
import { Card, CardContent, CardHeader } from "./card.js";

interface FormLoadingStateProps {
  title?: string;
  description?: string;
  fieldsCount?: number;
}

export function FormLoadingState({
  title = "Cargando...",
  description = "Obteniendo información",
  fieldsCount = 6,
}: FormLoadingStateProps) {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10 rounded-md" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>

      {/* Card Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Grid de campos */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {Array.from({ length: fieldsCount }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>

          {/* Campo de observaciones (textarea) */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-24 w-full" />
          </div>

          {/* Botón */}
          <div className="flex justify-end pt-4">
            <Skeleton className="h-10 w-32" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
