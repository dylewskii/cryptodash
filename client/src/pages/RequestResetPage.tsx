import { SyntheticEvent, useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

export default function RequestResetPage() {
  const [email, setEmail] = useState("");
  const [resetStatus, setResetStatus] = useState({
    success: true,
    msg: "",
  });

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (!email) {
      setResetStatus({
        success: false,
        msg: "Please enter a valid email address.",
      });
      return;
    }

    const options: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include" as RequestCredentials,
      body: JSON.stringify({
        email,
      }),
    };

    try {
      const response = await fetch(
        "http://localhost:8000/request-password-reset",
        options
      );
      const data = await response.json();

      if (!data.success) {
        setResetStatus({
          success: false,
          msg: "Failed to send reset link. Please try again.",
        });
      }

      setResetStatus({
        success: true,
        msg: "If an account exists under this email, you will receive a reset link shortly.",
      });
    } catch (err) {
      setResetStatus({
        success: false,
        msg: "Failed to send reset link. Please try again.",
      });
      console.error(err);
    }
  };
  return (
    <section className="h-full flex justify-center items-center">
      <div>
        <h2 className="text-2xl text-center mb-4">Reset Password</h2>
        <div className="flex flex-col gap-2">
          <label htmlFor="resetPass">Email Address:</label>
          <Input
            id="resetPass"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <Button onClick={handleSubmit} className="mt-4 mb-2 w-full">
          Send
        </Button>
        {!resetStatus.success ? (
          <p className="text-red-600">{resetStatus.msg}</p>
        ) : (
          <p className="text-green-600">{resetStatus.msg}</p>
        )}
      </div>
    </section>
  );
}
