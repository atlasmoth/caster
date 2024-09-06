import axios from "axios";

export const BASE_URL = "https://localhost:8445";

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
