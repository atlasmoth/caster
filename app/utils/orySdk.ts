import { Configuration, FrontendApi } from "@ory/client";
import axios from "axios";

export const newOrySdk = () =>
  new FrontendApi(
    new Configuration({
      basePath: "https://kratos.backpack.network",
      baseOptions: {
        withCredentials: false,
        timeout: 10000,
      },
    }),
    "",

    axios
  );
