import { refreshAccessToken } from "./apiUtils";

export const fetchAndSetProfilePicUrl = async (
  setProfilePicUrl: (url: string) => void
) => {
  try {
    const url = await fetchProfilePicUrl(refreshAccessToken);
    if (url) {
      setProfilePicUrl(url);
    }
  } catch (error) {
    console.error("Error fetching profile picture URL", error);
  }
};

export const fetchProfilePicUrl = async (
  refreshAccessToken: () => Promise<string | null>
) => {
  try {
    let accessToken = await refreshAccessToken();
    if (!accessToken) {
      throw new Error("Failed to refresh access token");
    }

    const response = await fetch(
      `http://localhost:8000/upload/profile-picture-url`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (response.status === 401) {
      // access token might be expired, try to refresh it
      accessToken = await refreshAccessToken();
      if (!accessToken) {
        throw new Error("Failed to refresh access token after 401");
      }

      // retry request with new access token
      const retryResponse = await fetch(
        `http://localhost:8000/upload/profile-picture-url`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!retryResponse.ok) {
        throw new Error(`HTTP error: ${retryResponse.status}`);
      }

      const retryData = await retryResponse.json();
      if (!retryData.success) {
        return null;
      }

      return retryData.presignedUrl;
    } else if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const data = await response.json();
    if (!data.success) {
      return null;
    }
    return data.presignedUrl;
  } catch (err) {
    console.error("Could not fetch profile picture URL", err);
    return null;
  }
};
