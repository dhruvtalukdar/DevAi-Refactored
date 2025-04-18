
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="text-center max-w-md p-6">
        <div className="mb-6 flex justify-center">
          <AlertTriangle size={64} className="text-warning animate-bounce" />
        </div>
        <h1 className="text-9xl font-bold mb-4 text-error">404</h1>
        <p className="text-xl mb-8 text-muted-foreground">Oops! The page you're looking for doesn't exist.</p>
        <Link to="/">
          <Button size="lg" className="gap-2">
            Return to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
