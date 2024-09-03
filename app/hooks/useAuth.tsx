import React, { useEffect, useState, ReactNode } from "react";
import { storage } from "../utils/storage";

interface AuthInterface {
  session: any;
  setSession: React.Dispatch<React.SetStateAction<any>>;
  loading: boolean;
  subscribed: boolean;
  setSubscribed: React.Dispatch<React.SetStateAction<boolean>>;
}

const authContext = React.createContext<Partial<AuthInterface>>({});

export const useAuth = (): AuthInterface => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    // storage.getItem("caster_key").then(async (t) => {
    //   try {
    //     setSession(t);
    //     if (t) {
    //       const tempUser = await fetchUser(t);
    //       setSession(tempUser);
    //     }
    //   } catch (error) {
    //     console.log(error);
    //   } finally {
    //     setLoading(false);
    //   }
    // });
  }, []);

  return { session, setSession, loading, subscribed, setSubscribed };
};

interface AuthProviderProps {
  children: (values: AuthInterface) => ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const values = useAuth();
  return (
    <authContext.Provider value={values}>
      {children(values)}
    </authContext.Provider>
  );
};

export default function AuthConsumer(): Partial<AuthInterface> {
  return React.useContext(authContext);
}
