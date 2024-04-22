import { SyntheticEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [failedLogin, setFailedLogin] = useState(false);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setFailedLogin(true);
    }

    fetch("http://localhost:8000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        username,
        password,
      }),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error("Failed to login");
        }
      })
      .then(() => {
        navigate("/app/home");
      })
      .catch((error) => {
        setFailedLogin(true);
        throw new Error(error);
      });
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
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
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

          {failedLogin && (
            <div className="mb-4">
              <p className="text-red-600">Failed to login. Please try again.</p>
            </div>
          )}

          <Button type="submit" className="w-80">
            Login
          </Button>
        </form>
      </div>
    </section>
  );
}
