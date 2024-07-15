import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="flex w-full px-4 pt-4 pb-4">
      <Link to={"/"}>
        <h1 className="text-2xl font-bold uppercase tracking-wide">
          Dashecrypte
        </h1>
      </Link>
    </header>
  );
}
