import { SyntheticEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [registrationFailed, setRegistrationFailed] = useState(false);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (!email || !username || !password || password !== passwordConfirm) {
      alert("Please complete all fields and ensure passwords match.");
      return;
    }
    try {
      // registration logic
      fetch("http://localhost:8000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      })
        .then((res) => {
          if (!res.ok) {
            setRegistrationFailed(true);
            throw new Error("Network response was not ok");
          }
          console.log(res);
          return res.json();
        })
        .then((data) => {
          console.log(data);
          navigate("/app/home");
        })
        .catch((error) => console.error("Error:", error));

      // navigate("/app/home");
    } catch (error) {
      console.error("Failed to register:", error);
      setRegistrationFailed(true);
    }
  };

  return (
    <section className="h-full flex justify-center items-center">
      <div>
        <h2 className="text-2xl text-center mb-4">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username">Email:</label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

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
              className="mb-4"
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label htmlFor="passwordConfirm">Confirm Password:</label>
            <Input
              id="passwordConfirm"
              type="password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <p>
              Already have an account?
              <a href="/" className="underline pl-2">
                Login
              </a>
            </p>
          </div>

          {registrationFailed && (
            <div className="mb-4">
              <p className="text-red-500">
                Failed to register. Please try again.
              </p>
            </div>
          )}

          <Button type="submit" className="w-80">
            Register
          </Button>
        </form>
      </div>
    </section>
  );
}
