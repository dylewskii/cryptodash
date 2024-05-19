import UserContext from "@/context/UserContext";
import { useContext } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import PasswordReset from "../misc/PasswordReset";

export default function ProfilePanel() {
  const { user } = useContext(UserContext);

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
      <div className="flex flex-col gap-4 w-64">
        <h3 className="text-2xl underline self-center">Profile</h3>
        <Label htmlFor="username">Username:</Label>
        <Input id="username" value={user.username} disabled></Input>

        <Label htmlFor="email">Email: </Label>
        <Input id="email" value={user.email} disabled></Input>
      </div>
    </section>
  );
}
