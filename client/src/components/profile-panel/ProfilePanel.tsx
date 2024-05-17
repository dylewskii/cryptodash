import UserContext from "@/context/UserContext";
import { useContext, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import PasswordInput from "../misc/PasswordInput";

export default function ProfilePanel() {
  const { user } = useContext(UserContext);
  const [passwordChangeInProgress, setPasswordChangeInProgress] =
    useState<boolean>(false);
  const [passwordChangeStatus, setPasswordChangeStatus] = useState({
    success: true,
    msg: "",
  });

  const handlePasswordChange = () => {
    setPasswordChangeInProgress(true);

    try {
      console.log("changing password");
    } catch (err) {
      setPasswordChangeStatus({
        msg: "failed to change password",
        success: false,
      });
    } finally {
      setPasswordChangeInProgress(false);
    }
  };
  return (
    <section className="flex flex-col items-center mt-10 gap-10">
      <div>
        <Avatar className="w-36 h-36">
          <AvatarImage src="" />
          <AvatarFallback className="text-5xl">
            {user.username.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="flex flex-col gap-4">
        <h3 className="text-2xl underline self-center">Profile</h3>
        <Label htmlFor="username">Username:</Label>
        <Input id="username" value={user.username} disabled></Input>

        <Label htmlFor="email">Email: </Label>
        <Input id="email" value={user.email} disabled></Input>

        <h3 className="text-2xl underline self-center">Security</h3>
        <div className="flex flex-col gap-2">
          <Label htmlFor="currentPassword">Current Password: </Label>
          <PasswordInput id="currentPassword" />

          <Label htmlFor="newPassword">New Password: </Label>
          <PasswordInput id="newPassword" />

          <Label htmlFor="newPasswordConfirmation">Confirm New Password:</Label>
          <PasswordInput id="newPasswordConfirmation" />
        </div>

        {passwordChangeInProgress ? (
          <Button className="w-80" disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving Password...
          </Button>
        ) : (
          <Button onClick={handlePasswordChange}>Save Changes</Button>
        )}
      </div>

      <div className="mb-4">
        {!passwordChangeStatus.success ? (
          <p className="text-red-600">{passwordChangeStatus.msg}</p>
        ) : (
          ""
        )}
      </div>
    </section>
  );
}
