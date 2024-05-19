import { SyntheticEvent } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import useResetPassword from "@/hooks/useResetPassword";
import { Label } from "../ui/label";
import { Loader2 } from "lucide-react";

interface PasswordResetProps {
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

/**
 * A reusable reset password component.
 *
 * @param {PasswordResetProps} props - the props for the component are: onChange & className.
 * @returns {JSX.Element} the reset password email input field and submit button to send the request.
 */
const PasswordReset: React.FC<PasswordResetProps> = ({ className }) => {
  const {
    email,
    setEmail,
    resetStatus,
    setResetStatus,
    isSubmitting,
    setIsSubmitting,
  } = useResetPassword();

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

    setIsSubmitting(true);

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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`flex flex-col ${className}`}>
      <h2 className="text-2xl mb-4 text-center">Forgot Password</h2>
      <div className="flex flex-col items-center gap-2">
        <Label htmlFor="sendResetLink" className="w-68 ">
          Enter the email address associated with your account and we'll send
          you a link to reset your password:
        </Label>
        <Input
          id="sendResetLink"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="reset@email.com"
          className="my-2 w-full"
        ></Input>
        {isSubmitting ? (
          <Button className="w-full" disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending...
          </Button>
        ) : (
          <Button onClick={handleSubmit} className="w-full">
            Reset Password
          </Button>
        )}
      </div>

      <p className={!resetStatus.success ? "text-red-600" : "text-green-600"}>
        {resetStatus.msg}
      </p>
    </div>
  );
};

export default PasswordReset;
