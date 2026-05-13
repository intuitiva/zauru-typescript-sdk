import { AlertCircle, ArrowLeft } from "lucide-react";
import { Link } from "react-router";
import { Button } from "./button.js";
import { Card, CardContent, CardHeader } from "./card.js";

interface NotFoundStateProps {
  title?: string;
  description?: string;
  backLink?: string;
  backLinkText?: string;
}

export function NotFoundState({
  title = "Recurso no encontrado",
  description = "El recurso que estás buscando no existe o ha sido eliminado.",
  backLink = "/",
  backLinkText = "Volver",
}: NotFoundStateProps) {
  return (
    <div className="flex flex-1 items-center justify-center p-4 md:p-6">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">{title}</h2>
            <p className="text-muted-foreground text-sm">{description}</p>
          </div>
          <div className="flex justify-center gap-2 pt-2">
            <Button variant="outline" asChild>
              <Link to={backLink}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                {backLinkText}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
