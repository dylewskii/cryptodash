import { SyntheticEvent, useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";

export default function ResetPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [resetStatus, setResetStatus] = useState({
    failed: false,
    msg: "Failed to Reset. Please enter a valid email.",
  });

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (!email) {
      setResetStatus((prevState) => ({
        ...prevState,
        failed: true,
      }));
    }

    fetch("http://localhost:8000/reset", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        email,
      }),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error("Failed to reset");
        }
      })
      .then(() => {
        navigate("/login");
      })
      .catch((error) => {
        setResetStatus((prevState) => ({
          ...prevState,
          failed: true,
        }));
        throw new Error(error);
      });
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
        {resetStatus.failed && (
          <p className="text-red-600">{resetStatus.msg}</p>
        )}
      </div>
    </section>
  );
}
