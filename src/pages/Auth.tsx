import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, BookOpen } from "lucide-react";
import { useEffect } from "react";
import { z } from "zod";
import { toast } from "@/hooks/use-toast";

// Validation schemas
const emailSchema = z.string().email("Email invalide").max(255, "Email trop long");
const passwordSchema = z.string()
  .min(6, "Le mot de passe doit contenir au moins 6 caractères")
  .max(100, "Le mot de passe ne peut pas dépasser 100 caractères");

const authSchema = z.object({
  email: emailSchema,
  password: passwordSchema
});

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Validate input
      const validationResult = authSchema.safeParse({ email, password });
      
      if (!validationResult.success) {
        const firstError = validationResult.error.errors[0];
        toast({
          title: "Validation échouée",
          description: firstError.message,
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      await signIn(validationResult.data.email, validationResult.data.password);
    } catch (error) {
      // Error is handled in AuthContext
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-accent/10 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-3xl font-bold font-poppins bg-gradient-brand bg-clip-text text-transparent">
            FlashPrint
          </h1>
          <p className="text-muted-foreground mt-2">Accédez à votre compte</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Connexion Administrateur</CardTitle>
            <CardDescription>
              Entrez vos identifiants pour accéder à l'administration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email">Email</Label>
                <Input
                  id="signin-email"
                  type="email"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  maxLength={255}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signin-password">Mot de passe</Label>
                <Input
                  id="signin-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={6}
                  maxLength={100}
                  required
                  disabled={isLoading}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connexion...
                  </>
                ) : (
                  "Se connecter"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Button variant="ghost" onClick={() => navigate('/')}>
            Retour à l'accueil
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
