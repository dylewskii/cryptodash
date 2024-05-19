import { useState } from "react";

/**
 * Custom hook to handle password reset requests.
 *
 * @returns email, setEmail, resetStatus, setResetStatus:
 * - `email`: Email state string value.
 * - `setEmail`: A function to set the email state value.
 * - `resetStatus`: State object describing the reset operation status.
 * - `setResetStatus`: A function to set the resetStatus state value.
 * - `isSubmitting`: State boolean indicating if the password is being reset.
 * - `setIsSubmitting`: A function to toggle the isSubmitting boolean state.
 */
const useResetPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetStatus, setResetStatus] = useState({
    success: true,
    msg: "",
  });

  return {
    email,
    setEmail,
    resetStatus,
    setResetStatus,
    isSubmitting,
    setIsSubmitting,
  };
};

export default useResetPassword;
