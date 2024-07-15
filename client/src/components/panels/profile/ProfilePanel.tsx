// react
import { useRef, useState } from "react";
// ui
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { Loader2 } from "lucide-react";
import { useUserStore } from "@/stores/useUserStore";
import { API_BASE_URL } from "@/config";

export default function ProfilePanel() {
  const accessToken = useUserStore((state) => state.accessToken);
  const user = useUserStore((state) => state.user);
  const profilePicUrl = useUserStore((state) => state.profilePicUrl);
  const setProfilePicUrl = useUserStore((state) => state.setProfilePicUrl);
  const hiddenFileUpload = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [errorStatus, setErrorStatus] = useState({
    success: true,
    msg: "",
  });

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

      const url = `${API_BASE_URL}/upload/profile-picture`;
      const options: RequestInit = {
        method: "POST",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      };

      setUploading(true);

      try {
        const response = await fetch(url, options);

        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setProfilePicUrl(data.presignedUrl);
          setErrorStatus({
            success: true,
            msg: "",
          });
        } else {
          const data = await response.json();
          console.error("Failed to upload avatar");
          setErrorStatus({
            success: false,
            msg: data.msg,
          });
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
        {uploading ? (
          <Loader2 className="mr-2 h-12 w-12 animate-spin" />
        ) : (
          <div
            className="relative w-36 h-36 cursor-pointer group"
            onClick={handleClick}
          >
            <Input
              id="picture"
              type="file"
              className="hidden"
              ref={hiddenFileUpload}
              onChange={handleFileChange}
            />
            <Avatar className="w-36 h-36">
              <AvatarImage
                src={profilePicUrl}
                className="group-hover:brightness-50 transition duration-300"
              />
              <AvatarFallback className="text-5xl">
                {user.username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <p className="absolute bottom-2 inset-x-0 text-center text-white opacity-0 group-hover:opacity-100 transition duration-300">
              EDIT
            </p>
          </div>
        )}
      </div>
      <div>
        <p className="text-red-600">
          {!errorStatus.success && errorStatus.msg}
        </p>
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
