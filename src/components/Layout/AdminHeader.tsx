import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { LogIn, User } from "lucide-react";

const AdminHeader = () => {
  const { user, isAdmin } = useAuth();

  return (
    <div className="bg-muted/50 border-b">
      <div className="container mx-auto px-4 py-2">
        <div className="flex justify-end items-center space-x-4">
          {user ? (
            <>
              <span className="text-sm text-muted-foreground">
                {user.email}
              </span>
              {isAdmin && (
                <Button variant="outline" size="sm" asChild>
                  <Link to="/admin">
                    <User className="h-4 w-4 mr-2" />
                    Admin
                  </Link>
                </Button>
              )}
            </>
          ) : (
            <Button variant="outline" size="sm" asChild>
              <Link to="/auth">
                <LogIn className="h-4 w-4 mr-2" />
                Connexion
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
