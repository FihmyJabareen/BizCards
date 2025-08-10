import { createContext, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  getToken,
  getUser,
  removeToken,
} from "../services/localStorageService";

const UserContext = createContext(null);

export default function UserProvider({ children }) {
  const [token, setToken] = useState(getToken());
  const [user, setUser] = useState(getUser());
  const [userFullDetails, setUserFullDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["x-auth-token"] = token;
    } else {
      delete axios.defaults.headers.common["x-auth-token"];
    }
  }, [token]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!user || !user?._id || !token) {
        setUserFullDetails(null);
        return;
      }
      setIsLoading(true);
      try {
        const { data } = await axios.get(
          `https://monkfish-app-z9uza.ondigitalocean.app/bcard2/users/${user._id}`
        );
        setUserFullDetails(data);
      } catch (err) {
        console.error("Failed to fetch user full details", err);
        if (err?.response?.status === 401) {
          handleLogout();
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDetails();
  }, [user?._id, token]);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === null || e.key === "token" || e.key === "user") {
        const t = getToken();
        const u = getUser();
        setToken(t);
        setUser(u);
      }
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const handleLogout = () => {
    try {
      removeToken();
    } catch (e) {
    }
    setToken(null);
    setUser(null);
    setUserFullDetails(null);
  };

  const value = useMemo(
    () => ({
      token,
      setToken,
      user,
      setUser,
      userFullDetails,
      setUserFullDetails,
      isLoading,
      logout: handleLogout,
    }),
    [token, user, userFullDetails, isLoading]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export const useCurrentUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useCurrentUser must be used within UserProvider");
  return ctx;
};
