import { Label } from "@radix-ui/react-label";
import PasswordReset from "../misc/PasswordReset";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Switch } from "../ui/switch";

export default function SettingsPanel() {
  return (
    <section className="flex flex-col items-center mt-10 gap-10">
      <h3 className="text-2xl underline self-center">Settings</h3>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Theme</CardTitle>
          <CardDescription>Choose your look and feel.</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Switch id="dark-mode" />
          <Label htmlFor="dark-mode">Dark Mode</Label>
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader className="p-0 px-6 pt-6">
          <CardTitle>Password Reset</CardTitle>
          <CardDescription>
            Forgot your password? Request a reset link below.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-2">
          <PasswordReset
            className="w-full"
            showTitle={false}
            showLabel={false}
          />
        </CardContent>
      </Card>
    </section>
  );
}
