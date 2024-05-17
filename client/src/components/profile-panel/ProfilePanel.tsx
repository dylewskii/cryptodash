import UserContext from "@/context/UserContext";
import { useContext } from "react";

export default function ProfilePanel() {
  const { user } = useContext(UserContext);
  return (
    <section>
      <div>
        <img />
      </div>
      <h3>Username: ${user.username}</h3>
    </section>
  );
}
