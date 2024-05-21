import UserContext from "@/context/UserContext";
import { useContext, useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

export default function ProfilePanel() {
  const { user } = useContext(UserContext);
  const hiddenFileUpload = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [profilePicUrl, setProfilePicUrl] = useState<string>("");

  const fetchProfilePicUrl = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/upload/profile-picture-url`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const data = await response.json();
      if (data.success) {
        setProfilePicUrl(data.presignedUrl);
      }
    } catch (err) {
      console.error("Could not fetch profile picture URL", err);
    }
  };

  useEffect(() => {
    fetchProfilePicUrl();
  }, []);

  // opens the file upload dialog
  const handleClick = () => {
    hiddenFileUpload.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files ? event.target.files[0] : null;

    if (selectedFile) {
      const formData = new FormData();
      formData.append("avatar", selectedFile);

      const url = `http://localhost:8000/upload/profile-picture`;

      setUploading(true);

      try {
        const response = await fetch(url, {
          method: "POST",
          credentials: "include",
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setProfilePicUrl(data.presignedUrl);
        } else {
          console.error("Failed to upload avatar");
        }
      } catch (err) {
        console.error("Could not send upload request to API", err);
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <section className="flex flex-col items-center mt-10 gap-10">
      <div>
        <Avatar
          className="w-36 h-36 cursor-pointer relative group hover:opacity-60"
          onClick={handleClick}
        >
          <p className="absolute pb-2 inset-0 flex items-end justify-center text-black opacity-0 group-hover:opacity-100 transition-opacity">
            EDIT
          </p>
          <Input
            id="picture"
            type="file"
            className="hidden"
            ref={hiddenFileUpload}
            onChange={handleFileChange}
          />
          <AvatarImage src={profilePicUrl} />
          <AvatarFallback className="text-5xl">
            {user.username.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        {uploading && <p>Uploading...</p>}
      </div>
      <div className="flex flex-col gap-4 w-64">
        <h3 className="text-2xl underline self-center">Profile</h3>
        <Label htmlFor="username">Username:</Label>
        <Input id="username" value={user.username} disabled></Input>

        <Label htmlFor="email">Email: </Label>
        <Input id="email" value={user.email} disabled></Input>

        <div className="grid w-full max-w-sm items-center gap-1.5"></div>
      </div>
    </section>
  );
}
