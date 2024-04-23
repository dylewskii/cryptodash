import { SyntheticEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [details, setDetails] = useState({
    email: "",
    username: "",
    password: "",
    passwordConfirm: "",
  });
  const [registrationStatus, setRegistrationStatus] = useState({
    failed: false,
    msg: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    // check if all fields entered
    if (
      !details.email ||
      !details.username ||
      !details.password ||
      !details.password ||
      !details.passwordConfirm
    ) {
      setRegistrationStatus({
        failed: true,
        msg: "Please complete all fields.",
      });
      return;
    }

    // check passwords match
    if (details.password !== details.passwordConfirm) {
      setRegistrationStatus({
        failed: true,
        msg: "Please ensure passwords match.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // registration logic
      const response = await fetch("http://localhost:8000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: details.username,
          email: details.email,
          password: details.password,
        }),
      });

      await response.json();

      if (!response.ok) {
        setRegistrationStatus({
          failed: true,
          msg: "Registration Failed. Please Try Again.",
        });
      }

      navigate("/app/home");
    } catch (error) {
      console.error("Failed to register:", error);
      setRegistrationStatus({ failed: true, msg: "Failed to register" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (name: string, value: string) => {
    setDetails((prev) => ({ ...prev, [name]: value }));
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
              value={details.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="username">Username:</label>
            <Input
              id="username"
              type="text"
              value={details.username}
              onChange={(e) => handleChange("username", e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password">Password:</label>
            <Input
              className="mb-4"
              id="password"
              type="password"
              value={details.password}
              onChange={(e) => handleChange("password", e.target.value)}
            />
            <label htmlFor="passwordConfirm">Confirm Password:</label>
            <Input
              id="passwordConfirm"
              type="password"
              value={details.passwordConfirm}
              onChange={(e) => handleChange("passwordConfirm", e.target.value)}
            />
          </div>

          <div className="mb-4">
            <p>
              Already have an account?
              <Link to="/" className="underline pl-2">
                Login
              </Link>
            </p>
          </div>

          {registrationStatus.failed && (
            <div className="mb-4">
              <p className="text-red-500">{registrationStatus.msg}</p>
            </div>
          )}

          <Button type="submit" className="w-80" disabled={isSubmitting}>
            {isSubmitting ? "Registering..." : "Register"}
          </Button>
        </form>
      </div>
    </section>
  );
}
