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
      return data.presignedUrl;
    }
    return null;
  } catch (err) {
    console.error("Could not fetch profile picture URL", err);
  }
};

export default fetchProfilePicUrl;
