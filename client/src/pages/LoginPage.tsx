import { SyntheticEvent, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Loader2 } from "lucide-react";
import UserContext from "@/context/UserContext";
import PasswordInput from "@/components/misc/PasswordInput";

export default function LoginPage() {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginStatus, setLoginStatus] = useState({
    failed: false,
    msg: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setLoginStatus({
        failed: true,
        msg: "Username and password are both required.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setLoginStatus({
          failed: true,
          msg: data.msg || "Login Failed. Please Try Again.",
        });
        return;
      }

      setUser({
        userId: data.user.id,
        username: data.user.username,
        email: data.user.email,
        isAuthenticated: true,
      });

      navigate("/app/home");
    } catch (error) {
      setLoginStatus({
        failed: true,
        msg: "Failed to Login",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="h-full flex justify-center items-center">
      <div>
        <h2 className="text-2xl text-center mb-4">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username">Username:</label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password">Password:</label>
            <div className="flex items-center gap-2">
              <PasswordInput
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          <div className="mb-4">
            <p>
              Forgot your password?
              <Link to="/reset" className="underline pl-1">
                Reset
              </Link>
            </p>
            <p>
              Don't have an account?
              <Link to="/register" className="underline pl-1">
                Sign Up
              </Link>
            </p>
          </div>

          {loginStatus.failed && (
            <div className="mb-4">
              <p className="text-red-600">{loginStatus.msg}</p>
            </div>
          )}

          {isSubmitting ? (
            <Button className="w-80" disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Logging in...
            </Button>
          ) : (
            <Button type="submit" className="w-80">
              Login
            </Button>
          )}
        </form>
      </div>
    </section>
  );
}
