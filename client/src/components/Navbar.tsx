import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Navbar() {
  return (
    <header className="flex justify-between items-center m-4">
      <div className="logo">
        <p>CryptoDash</p>
      </div>
      <nav className="flex gap-4 items-center">
        <div className="controls"></div>
        <div className="profile">
          <Avatar>
            <AvatarImage src="https://github.com/dylewskii.png" />
            <AvatarFallback>User</AvatarFallback>
          </Avatar>
        </div>
      </nav>
    </header>
  );
}
