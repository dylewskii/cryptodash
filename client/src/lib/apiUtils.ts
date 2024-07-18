/* eslint-disable @typescript-eslint/no-explicit-any */
import { API_BASE_URL } from "@/config";
import { UserType, defaultUser } from "@/types";

/**
 * Refreshes the access token by making a request to the refresh-token endpoint.
 *
 * @returns {Promise<string | null>} A promise that resolves to the new access token if successful, or null if the refresh failed.
 */
export const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      if (response.status === 401) {
        // user not authenticated - expected when logged out
        return null;
      }
      throw new Error(`HTTP error status: ${response.status}`);
    }

    const data = await response.json();

    return data.accessToken;
  } catch (error) {
    return null;
  }
};

/**
 * Makes an authenticated fetch request with the given URL, token, and method.
 *
 * @param {string} url - URL to make the request to
 * @param {string} token - access token to use for authentication
 * @param {string} [method="GET"] - HTTP method to use for the request
 * @returns {Promise<any>} A promise that resolves to the response data.
 * @throws {Error} Throws an error if the authentication fails.
 */
export const fetchWithAuth = async (
  url: string,
  token: string,
  method: string = "GET"
): Promise<any> => {
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

/**
 * Extracts user data from the response and returns a UserType object.
 *
 * @param {any} data - data from which to extract user information
 * @returns {UserType} The extracted user information
 */
const getUserFromData = (data: any): UserType => ({
  userId: data.user._id,
  username: data.user.username,
  email: data.user.email,
  isAuthenticated: true,
});

/**
 * Verifies the provided token by making a request to the check-auth endpoint.
 *
 * @param {string} token - token to verify
 * @returns {Promise<UserType>} promise that resolves to the user info if the token is valid
 * @throws {Error} Throws an error if the token verification fails
 */
const verifyToken = async (token: string): Promise<UserType> => {
  const url = `${API_BASE_URL}/auth/check-auth`;
  const data = await fetchWithAuth(url, token);
  return getUserFromData(data);
};

/**
 * Checks the auth status of a user, refreshes tokens if necessary & updates the user state.
 *
 * @param {string} accessToken - The current access token.
 * @param {function} setAccessToken - A function to update the access token.
 * @param {function} setUser - A function to update the user state.
 * @returns {Promise<void>}
 */
export const checkAuth = async (
  accessToken: string | null,
  setAccessToken: (token: string) => void,
  setUser: (user: UserType) => void
): Promise<void> => {
  const attemptAuthentication = async (
    token: string
  ): Promise<UserType | null> => {
    // 1. checks if there is an existing access token
    // 2. if no token -> try to refresh
    // 3. if can't get a valid token -> set the user to an unauthenticated state
    // 4. if there is a token -> attempt to verify it
    // 5. if verification fails -> try to refresh the token once more & verify again
    // 6. if all attempts fail -> set the user to an unauthenticated state
    // 7. if any attempt succeeds -> update the user state with the auth user data

    try {
      // try to verify the token and get user data
      return await verifyToken(token);
    } catch (error) {
      console.error("Token verification failed:", error);
      return null;
    }
  };

  // reset user to default state & clear access token
  const handleUnauthenticated = () => {
    setUser(defaultUser);
    setAccessToken("");
  };

  try {
    let token = accessToken;

    // if token is invalid, try to refresh
    if (!token) {
      token = await refreshAccessToken();
      if (token) setAccessToken(token);
    }

    // if still invalid, reset users
    if (!token) {
      handleUnauthenticated();
      return;
    }

    // attempt to authenticate with current token
    let user = await attemptAuthentication(token);

    // if authentication fails, try refreshing token
    if (!user) {
      token = await refreshAccessToken();
      // if token invalid, handle as unathenticated
      if (!token) {
        handleUnauthenticated();
        return;
      }

      // update access token to the newly fetched token
      setAccessToken(token);

      // attempt authentication again with the new token
      user = await attemptAuthentication(token);

      // if auth fails again, handle as unauthenticated
      if (!user) {
        handleUnauthenticated();
        return;
      }
    }

    // auth succesful
    setUser(user);
  } catch (error) {
    console.error("Error during authentication check:", error);
    handleUnauthenticated();
  }
};
