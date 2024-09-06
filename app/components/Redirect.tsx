import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import Loading from "../screens/Loading";

export function RedirectFeed({ screen: Screen, ...props }: any) {
  const { session, subscribed, loading } = useAuth();
  useEffect(() => {
    if (!loading) {
      if (!session) {
        props.navigation.replace("Signin");
      }

      if (session && !subscribed) {
        props.navigation.replace("CreatePayment");
      }
    }
  }, [session, props.navigation, subscribed, loading]);

  if (loading) return <Loading />;
  return <Screen {...props} />;
}

export function RedirectSubscription({ screen: Screen, ...props }: any) {
  const { session, subscribed, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!session) {
        props.navigation.replace("Signin");
      }

      if (subscribed) {
        props.navigation.replace("MediaFeed");
      }
    }
  }, [session, subscribed, props.navigation, loading]);
  if (loading) return <Loading />;
  return <Screen {...props} />;
}

export function RedirectSignin({ screen: Screen, ...props }: any) {
  const { session, subscribed, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (session && subscribed) {
        props.navigation.replace("MediaFeed");
      }

      if (session && !subscribed) {
        props.navigation.replace("CreatePayment");
      }
    }
  }, [session, subscribed, props.navigation, loading]);
  if (loading) return <Loading />;
  return <Screen {...props} />;
}
