import { useState, useEffect } from "react";
import { Button } from "./button.js";
import { Card } from "./card.js";
import { X } from "lucide-react";

interface ServiceWorkerUpdateBannerProps {
  onUpdate: () => void;
  onDismiss: () => void;
}

export function ServiceWorkerUpdateBanner({
  onUpdate,
  onDismiss,
}: ServiceWorkerUpdateBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!isVisible) {
      onDismiss();
    }
  }, [isVisible, onDismiss]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md animate-in slide-in-from-bottom-5">
      <Card className="p-4 shadow-lg border-2 border-primary/20">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <h3 className="font-semibold text-sm mb-1">
              Nueva versión disponible
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              Hay una actualización de la aplicación disponible. Actualiza para
              obtener las últimas mejoras y correcciones.
            </p>
            <div className="flex gap-2">
              <Button size="sm" onClick={onUpdate}>
                Actualizar ahora
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsVisible(false)}
              >
                Más tarde
              </Button>
            </div>
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6"
            onClick={() => setIsVisible(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
