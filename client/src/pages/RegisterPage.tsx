// react
import { SyntheticEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// ui
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import PasswordInput from "@/components/misc/PasswordInput";
import { Label } from "@/components/ui/label";
// stores
import { useUserStore } from "@/stores/useUserStore";
// env
import { API_BASE_URL } from "@/config";

export default function RegisterPage() {
  const navigate = useNavigate();
  const setAccessToken = useUserStore((state) => state.setAccessToken);
  const setUser = useUserStore((state) => state.setUser);
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
      !details.passwordConfirm
    ) {
      setRegistrationStatus({
        failed: true,
        msg: "Please complete all fields.",
      });
      return;
    }

    // check password is not less than 6 characters
    if (details.password.length < 6) {
      setRegistrationStatus({
        failed: true,
        msg: "Please ensure password is at least 6 characters long.",
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
      const url = `${API_BASE_URL}/auth/register`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username: details.username,
          email: details.email,
          password: details.password,
          passwordConfirm: details.passwordConfirm,
        }),
      });

      if (!response.ok) {
        setRegistrationStatus({
          failed: true,
          msg: "Registration Failed. Please Try Again.",
        });
        return;
      }

      const data = await response.json();
      const token = data.token.split(" ")[1];

      setAccessToken(token);
      setUser({
        userId: data.user.id,
        username: data.user.username,
        email: data.user.email,
        isAuthenticated: true,
      });
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
    <main className="flex flex-col justify-center items-center">
      <div>
        <h2 className="text-2xl text-center mb-4">Create an Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label htmlFor="email">Email:</Label>
            <Input
              name="email"
              id="email"
              type="email"
              value={details.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </div>

          <div className="mb-4">
            <Label htmlFor="username">Username:</Label>
            <Input
              name="username"
              id="username"
              type="text"
              value={details.username}
              onChange={(e) => handleChange("username", e.target.value)}
            />
          </div>

          <div className="mb-4">
            <Label htmlFor="password">Password:</Label>
            <PasswordInput
              id="password"
              className="w-full mb-4"
              value={details.password}
              onChange={(e) => handleChange("password", e.target.value)}
            />

            <Label htmlFor="passwordConfirm">Confirm Password:</Label>
            <div className="flex items-center gap-2">
              <PasswordInput
                id="passwordConfirm"
                value={details.passwordConfirm}
                onChange={(e) =>
                  handleChange("passwordConfirm", e.target.value)
                }
                className="w-full"
              />
            </div>
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
      <p className="flex max-w-[300px] mt-4 text-zinc-400 text-center">
        By registering, you agree to our Terms of Service and Privacy Policy
      </p>
    </main>
  );
}
