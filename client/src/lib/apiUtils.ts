import { UserType, defaultUser } from "@/types";

export const refreshAccessToken = async () => {
  try {
    const response = await fetch("http://localhost:8000/auth/refresh-token", {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to refresh token");
    }

    const data = await response.json();
    return data.accessToken;
  } catch (error) {
    console.error("Error refreshing token:", error);
    return null;
  }
};

export const fetchWithAuth = async (
  url: string,
  token: string,
  method: string = "GET"
) => {
  const response = await fetch(url, {
    method: method.toUpperCase(),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });
  if (!response.ok) throw new Error("Authentication failed");
  return response.json();
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getUserFromData = (data: any): UserType => ({
  userId: data.user._id,
  username: data.user.username,
  email: data.user.email,
  isAuthenticated: true,
});

const verifyToken = async (token: string): Promise<UserType> => {
  const url = `http://localhost:8000/auth/check-auth`;
  const data = await fetchWithAuth(url, token);
  return getUserFromData(data);
};

export const checkAuth = async (
  accessToken: string,
  setAccessToken: (token: string) => void,
  setUser: (user: UserType) => void
): Promise<void> => {
  try {
    let token = accessToken;

    // if token is invalid, try to refresh
    if (!token) {
      token = await refreshAccessToken();
      if (token) setAccessToken(token);
    }

    // if still invalid, reset user
    if (!token) {
      setUser(defaultUser);
      return;
    }

    try {
      const user = await verifyToken(token);
      setUser(user);
    } catch (error) {
      // if verification fails, try refreshing once more
      token = await refreshAccessToken();
      if (!token) {
        setUser(defaultUser);
        return;
      }

      setAccessToken(token);

      try {
        const user = await verifyToken(token);
        setUser(user);
      } catch (retryError) {
        console.error("Authentication failed after token refresh:", retryError);
        setUser(defaultUser);
      }
    }
  } catch (error) {
    console.error("Error during authentication check:", error);
    setUser(defaultUser);
  }
};
