import { SyntheticEvent, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Loader2 } from "lucide-react";
import UserContext from "@/context/UserContext";

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
  const [passwordHidden, setPasswordHidden] = useState(true);

  const togglePasswordVisibility = () => {
    setPasswordHidden(!passwordHidden);
  };

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
              <Input
                id="password"
                type={passwordHidden ? "password" : "text"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {passwordHidden ? (
                <svg
                  className="w-6 h-6 cursor-pointer"
                  viewBox="0 0 24 24"
                  onClick={togglePasswordVisibility}
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10.7429 5.09232C11.1494 5.03223 11.5686 5 12.0004 5C17.1054 5 20.4553 9.50484 21.5807 11.2868C21.7169 11.5025 21.785 11.6103 21.8231 11.7767C21.8518 11.9016 21.8517 12.0987 21.8231 12.2236C21.7849 12.3899 21.7164 12.4985 21.5792 12.7156C21.2793 13.1901 20.8222 13.8571 20.2165 14.5805M6.72432 6.71504C4.56225 8.1817 3.09445 10.2194 2.42111 11.2853C2.28428 11.5019 2.21587 11.6102 2.17774 11.7765C2.1491 11.9014 2.14909 12.0984 2.17771 12.2234C2.21583 12.3897 2.28393 12.4975 2.42013 12.7132C3.54554 14.4952 6.89541 19 12.0004 19C14.0588 19 15.8319 18.2676 17.2888 17.2766M3.00042 3L21.0004 21M9.8791 9.87868C9.3362 10.4216 9.00042 11.1716 9.00042 12C9.00042 13.6569 10.3436 15 12.0004 15C12.8288 15 13.5788 14.6642 14.1217 14.1213"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6 cursor-pointer"
                  onClick={togglePasswordVisibility}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2.42012 12.7132C2.28394 12.4975 2.21584 12.3897 2.17772 12.2234C2.14909 12.0985 2.14909 11.9015 2.17772 11.7766C2.21584 11.6103 2.28394 11.5025 2.42012 11.2868C3.54553 9.50484 6.8954 5 12.0004 5C17.1054 5 20.4553 9.50484 21.5807 11.2868C21.7169 11.5025 21.785 11.6103 21.8231 11.7766C21.8517 11.9015 21.8517 12.0985 21.8231 12.2234C21.785 12.3897 21.7169 12.4975 21.5807 12.7132C20.4553 14.4952 17.1054 19 12.0004 19C6.8954 19 3.54553 14.4952 2.42012 12.7132Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12.0004 15C13.6573 15 15.0004 13.6569 15.0004 12C15.0004 10.3431 13.6573 9 12.0004 9C10.3435 9 9.0004 10.3431 9.0004 12C9.0004 13.6569 10.3435 15 12.0004 15Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
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
