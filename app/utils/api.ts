import axios from "axios";

export const BASE_URL = "http://localhost:8084";

export const whoAmI = async (key: string) => {
  const { data } = await axios.get(`${BASE_URL}/users/whoami`, {
    headers: {
      Accept: "Application/json",
      "Content-Type": "Application/json",
      Authorization: `Bearer ${key}`,
    },
    withCredentials: false,
  });
  return data;
};
