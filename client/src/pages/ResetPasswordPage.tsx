// react
import { SyntheticEvent, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
// ui
import PasswordInput from "@/components/misc/PasswordInput";
import { Button } from "../components/ui/button";
import { Label } from "@/components/ui/label";
// env
import { API_BASE_URL } from "@/config";

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

export default function ResetPasswordPage() {
  const query = useQuery();
  const navigate = useNavigate();
  const resetToken = query.get("token");
  const [newPassword, setNewPassword] = useState<string>("");
  const [newPasswordConfirmation, setNewPasswordConfirmation] =
    useState<string>("");
  const [resetStatus, setResetStatus] = useState({
    success: true,
    msg: "",
  });

  // check if /reset-password has a resetToken, if not redirect
  useEffect(() => {
    if (!resetToken) {
      navigate("/login");
    }
  }, [resetToken, navigate]);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (newPassword !== newPasswordConfirmation) {
      setResetStatus({
        success: false,
        msg: "Passwords do not match.",
      });
      return;
    }

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        resetToken,
        newPassword,
        newPasswordConfirmation,
      }),
    };

    try {
      const url = `${API_BASE_URL}/auth/reset-password`;
      const response = await fetch(url, options);
      const data = await response.json();

      if (!response.ok) {
        setResetStatus({
          success: false,
          msg: data.msg,
        });
        return;
      }

      // TODO: IMPROVE UX (ADD TOAST ETC)
      navigate("/login");
    } catch (err) {
      setResetStatus({
        success: false,
        msg: "An error occurred while resetting the password",
      });
    }
  };

  return (
    <div className="flex flex-col px-10 py-10">
      <h2 className="text-3xl self-center mb-4">Reset Password</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <Label htmlFor="newPassword">New Password</Label>
          <PasswordInput
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="pt-1"
          />
        </div>
        <div>
          <Label htmlFor="newPasswordConfirmation">Confirm New Password</Label>
          <PasswordInput
            id="newPasswordConfirmation"
            value={newPasswordConfirmation}
            onChange={(e) => setNewPasswordConfirmation(e.target.value)}
            className="pt-1"
          />
        </div>
        <Button type="submit" className="mt-4">
          Reset Password
        </Button>
      </form>
      <div>
        {!resetStatus.success ? (
          <p className="text-red-600">{resetStatus.msg}</p>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
