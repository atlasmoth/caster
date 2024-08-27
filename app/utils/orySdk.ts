import { Configuration, FrontendApi } from "@ory/client";
import axios from "axios";

export const newOrySdk = () =>
  new FrontendApi(
    new Configuration({
      basePath: "http://localhost:4433",
      baseOptions: {
        // Setting this is very important as axios will send the CSRF cookie otherwise
        // which causes problems with Ory Kratos' security detection.
        withCredentials: false,

        // Timeout after 5 seconds.
        timeout: 10000,
      },
    }),
    "",
    // Ensure that we are using the axios client with retry.
    axios
  );
