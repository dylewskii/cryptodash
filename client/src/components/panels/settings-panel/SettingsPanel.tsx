// components
import PasswordReset from "../../misc/PasswordReset";
// ui
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import ModeToggle from "../../ui/mode-toggle";

export default function SettingsPanel() {
  return (
    <section className={`flex flex-col items-center mt-10 gap-10`}>
      <h3 className="text-2xl underline self-center">Settings</h3>

      <Card className="w-full flex items-center justify-between">
        <CardHeader>
          <CardTitle>Theme</CardTitle>
          <CardDescription>Choose your look and feel.</CardDescription>
        </CardHeader>
        <CardContent>
          <ModeToggle />
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
