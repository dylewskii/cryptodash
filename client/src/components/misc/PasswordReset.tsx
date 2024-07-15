import { SyntheticEvent } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import useResetPassword from "@/hooks/useResetPassword";
import { Label } from "../ui/label";
import { Loader2 } from "lucide-react";
import { API_BASE_URL } from "@/config";

interface PasswordResetProps {
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  showTitle: boolean;
  showLabel: boolean;
  title?: string;
  label?: string;
}

/**
 * A reusable reset password component.
 *
 * @param {PasswordResetProps} props - the props for the component are: onChange & className.
 * @returns {JSX.Element} the reset password email input field and submit button to send the request.
 */
const PasswordReset: React.FC<PasswordResetProps> = ({
  className,
  showTitle,
  showLabel,
  title,
  label,
}) => {
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
        `${API_BASE_URL}/auth/request-password-reset`,
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
      {showTitle && (
        <h2 className="text-2xl mb-4 text-center">
          {title ? title : "Forgot Password"}
        </h2>
      )}
      <div className="flex flex-col items-center gap-2">
        {showLabel && (
          <Label htmlFor="sendResetLink" className="w-68">
            {label
              ? label
              : "Enter the email address associated with your account and we'll send you a link to reset your password:"}
          </Label>
        )}
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

      <p
        className={
          !resetStatus.success ? "text-red-600 pt-3" : "text-green-600 pt-3"
        }
      >
        {resetStatus.msg}
      </p>
    </div>
  );
};

export default PasswordReset;
