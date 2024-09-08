import { Configuration, FrontendApi } from "@ory/client";
import axios from "axios";

const AUTH_BASE_URL = process.env.EXPO_PUBLIC_AUTH_BASE_URL;

export const newOrySdk = () =>
  new FrontendApi(
    new Configuration({
      basePath: AUTH_BASE_URL,
      baseOptions: {
        withCredentials: false,
        timeout: 10000,
      },
    }),
    "",

    axios
  );
