import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LogIn, Shield, AlertTriangle } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Import security utilities
import { commonSchemas, validateData } from "@/utils/validation";
import { generateCsrfToken, validateCsrfToken } from "@/utils/csrf";
import { SecureStorage } from "@/utils/secure-storage";
import { isLoginRateLimited, resetRateLimit } from "@/utils/auth-security";

// Define the form schema with enhanced security validation
const formSchema = z.object({
  email: commonSchemas.email,
  password: z.string().min(8, "Password must be at least 8 characters")
    .max(100, "Password is too long")
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),
  csrfToken: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface LoginFormProps {
  onNavigateToSignup: () => void;
}

const LoginForm = ({ onNavigateToSignup }: LoginFormProps) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false);
  const [csrfToken, setCsrfToken] = React.useState("");
  const [isRateLimited, setIsRateLimited] = React.useState(false);
  const [loginAttempts, setLoginAttempts] = React.useState(0);
  const [securityMessage, setSecurityMessage] = React.useState("");

  // Generate CSRF token on component mount
  useEffect(() => {
    const generateToken = async () => {
      try {
        // Use a session ID or device ID as the user identifier before login
        const sessionId = await SecureStorage.getItem('session_id') || 
          crypto.randomUUID();
        
        // Store the session ID securely
        await SecureStorage.setItem('session_id', sessionId);
        
        // Generate a CSRF token
        const { token } = generateCsrfToken(sessionId);
        setCsrfToken(token);
      } catch (error) {
        console.error('Error generating CSRF token:', error);
        setSecurityMessage('Error initializing security features');
      }
    };
    
    generateToken();
    
    // Check for previous login attempts in secure storage
    const checkPreviousAttempts = async () => {
      const attempts = await SecureStorage.getItem('login_attempts');
      if (attempts) {
        const { count, timestamp } = JSON.parse(attempts);
        const now = Date.now();
        
        // If attempts were within the last hour, check rate limiting
        if (now - timestamp < 60 * 60 * 1000) {
          setLoginAttempts(count);
          if (count >= 5) {
            setIsRateLimited(true);
            setSecurityMessage('Too many login attempts. Please try again later.');
          }
        } else {
          // Reset if more than an hour has passed
          await SecureStorage.removeItem('login_attempts');
        }
      }
    };
    
    checkPreviousAttempts();
  }, []);

  // Initialize form with CSRF token
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      csrfToken: "",
    },
  });
  
  // Update form when CSRF token is generated
  useEffect(() => {
    if (csrfToken) {
      form.setValue('csrfToken', csrfToken);
    }
  }, [csrfToken, form]);

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    
    // Check for rate limiting
    if (isRateLimited) {
      setIsLoading(false);
      toast({
        title: "Login temporarily disabled",
        description: "Too many failed attempts. Please try again later.",
        variant: "destructive",
      });
      return;
    }
    
    // Validate CSRF token
    const sessionId = await SecureStorage.getItem('session_id');
    if (!sessionId || !data.csrfToken || !validateCsrfToken(data.csrfToken, sessionId)) {
      setIsLoading(false);
      setSecurityMessage('Security validation failed. Please refresh the page and try again.');
      toast({
        title: "Security Error",
        description: "Invalid security token. Please refresh the page.",
        variant: "destructive",
      });
      return;
    }
    
    // Validate input data with our security utilities
    const validationResult = validateData(formSchema, data);
    if (!validationResult.success) {
      setIsLoading(false);
      toast({
        title: "Validation Error",
        description: "Please check your input and try again.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Track login attempts for rate limiting
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      await SecureStorage.setItem('login_attempts', JSON.stringify({
        count: newAttempts,
        timestamp: Date.now()
      }));
      
      // Check if rate limited after this attempt
      if (newAttempts >= 5) {
        setIsRateLimited(true);
        setSecurityMessage('Too many login attempts. Please try again later.');
      }
      
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      
      if (error) throw error;
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setIsGoogleLoading(true);
      console.log("Starting Google auth from Login page, origin:", window.location.origin);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
          redirectTo: `${window.location.origin}/role-select`,
        },
      });
      
      if (error) {
        console.error("Google auth error:", error);
        throw error;
      }
      
      // Reset login attempts on successful login
      await SecureStorage.removeItem('login_attempts');
      setLoginAttempts(0);
      setIsRateLimited(false);
    } catch (error: any) {
      console.error("Google signin error:", error);
      toast({
        title: "Error signing in with Google",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="grid gap-6">
      {securityMessage && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{securityMessage}</AlertDescription>
        </Alert>
      )}
      
      {/* Security indicator */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center">
          <Shield className="h-3 w-3 mr-1" />
          <span>Secure login</span>
        </div>
        {csrfToken && (
          <span>CSRF Protection Active</span>
        )}
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="email" placeholder="Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="password" placeholder="Password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button 
            type="submit"
            className="w-full" 
            disabled={isLoading || isGoogleLoading}
          >
            {isLoading ? "Signing in..." : (
              <>
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </>
            )}
          </Button>
        </form>
      </Form>
      
      <div className="flex items-center gap-2 my-2">
        <Separator className="flex-1" />
        <span className="text-xs text-gray-500">OR</span>
        <Separator className="flex-1" />
      </div>
      
      <Button 
        variant="outline"
        className="w-full" 
        onClick={signInWithGoogle}
        disabled={isLoading || isGoogleLoading}
      >
        <div className="w-4 h-4 mr-2 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            <path fill="none" d="M1 1h22v22H1z" />
          </svg>
        </div>
        {isGoogleLoading ? "Signing in..." : "Sign In with Google"}
      </Button>

      <div className="text-center mt-4">
        <Button
          variant="link"
          onClick={onNavigateToSignup}
          className="text-sm"
          disabled={isLoading || isGoogleLoading}
        >
          Don't have an account? Sign up
        </Button>
      </div>
    </div>
  );
};

export default LoginForm;
