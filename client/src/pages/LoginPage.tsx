// react
import { SyntheticEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
// ui
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Loader2 } from "lucide-react";
import PasswordInput from "@/components/misc/PasswordInput";
// stores
import { useUserStore } from "@/stores/useUserStore";
// env
import { API_BASE_URL } from "@/config";

export default function LoginPage() {
  const setAccessToken = useUserStore((state) => state.setAccessToken);
  const setUser = useUserStore((state) => state.setUser);
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
      const URL = `${API_BASE_URL}/auth/login`;

      const response = await fetch(URL, {
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

      const responseText = await response.text();

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        throw new Error("Invalid JSON response");
      }

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

      setAccessToken(data.accessToken);

      navigate("/app/home");
    } catch (error) {
      setLoginStatus({
        failed: true,
        msg: error instanceof Error ? error.message : "Failed to Login",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="flex justify-center items-center">
      <div>
        <h2 className="text-2xl text-center mb-4">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username">Username:</label>
            <Input
              className="mt-2"
              name="username"
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password">Password:</label>
            <div className="flex items-center gap-2">
              <PasswordInput
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-2"
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
