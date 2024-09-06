import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";

export function RedirectFeed({ screen: Screen, ...props }: any) {
  const { session, subscribed } = useAuth();
  useEffect(() => {
    if (!session) {
      props.navigation.replace("Signin");
    }

    if (session && !subscribed) {
      props.navigation.replace("CreatePayment");
    }
  }, [session, props.navigation, subscribed]);

  return <Screen {...props} />;
}

export function RedirectSubscription({ screen: Screen, ...props }: any) {
  const { session, subscribed } = useAuth();

  useEffect(() => {
    if (!session) {
      props.navigation.replace("Signin");
    }

    if (subscribed) {
      props.navigation.replace("MediaFeed");
    }
  }, [session, subscribed, props.navigation]);
  return <Screen {...props} />;
}

export function RedirectSignin({ screen: Screen, ...props }: any) {
  const { session, subscribed } = useAuth();

  useEffect(() => {
    if (session && subscribed) {
      props.navigation.replace("MediaFeed");
    }

    if (session && !subscribed) {
      props.navigation.replace("CreatePayment");
    }
  }, [session, subscribed, props.navigation]);
  return <Screen {...props} />;
}
