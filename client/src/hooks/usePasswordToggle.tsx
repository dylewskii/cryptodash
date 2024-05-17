import { useState } from "react";

/**
 * Custom hook to manage password visibility toggle.
 *
 * @returns passwordHidden & togglePasswordVisibility:
 * - `passwordHidden`: A boolean flag which indicates whether the password is hidden.
 * - `togglePasswordVisibility`: A function to toggle the password visibility.
 */
const usePasswordToggle = (): [boolean, () => void] => {
  const [passwordHidden, setPasswordHidden] = useState(true);

  const togglePasswordVisibility = () => {
    setPasswordHidden(!passwordHidden);
  };

  return [passwordHidden, togglePasswordVisibility];
};

export default usePasswordToggle;
