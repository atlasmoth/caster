import React, { useEffect, useState, ReactNode } from "react";
import { storage } from "../utils/storage";
import { SuccessfulNativeLogin } from "@ory/client";
import { whoAmI } from "../utils/api";

interface AuthInterface {
  session: Pick<SuccessfulNativeLogin, "session" | "session_token"> | null;
  setSession: React.Dispatch<
    React.SetStateAction<Pick<
      SuccessfulNativeLogin,
      "session" | "session_token"
    > | null>
  >;
  loading: boolean;
  subscribed: boolean;
  setSubscribed: React.Dispatch<React.SetStateAction<boolean>>;
}

const authContext = React.createContext<Partial<AuthInterface>>({});

export const useAuth = (): AuthInterface => {
  const [session, setSession] = useState<Omit<
    SuccessfulNativeLogin,
    "continue_with"
  > | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    storage.getItem("caster_key").then(async (t) => {
      try {
        const oldSession = JSON.parse(t || "null");

        if (oldSession) {
          const userData = await whoAmI(oldSession.session_token);
          setSession(oldSession);
          if (userData.data) {
            setSubscribed(true);
          }
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    });
  }, []);

  return { session, setSession, loading, subscribed, setSubscribed };
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const values = useAuth();
  return <authContext.Provider value={values}>{children}</authContext.Provider>;
};

export default function AuthConsumer(): Partial<AuthInterface> {
  return React.useContext(authContext);
}
