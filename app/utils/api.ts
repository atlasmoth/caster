import axios from "axios";

export const BASE_URL = "https://209.38.76.212:8445";

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

export const getFeed = async (key: string, cursor: string) => {
  const { data } = await axios.get(`${BASE_URL}/users/feed?cursor=${cursor}`, {
    headers: {
      Accept: "Application/json",
      "Content-Type": "Application/json",
      Authorization: `Bearer ${key}`,
    },
    withCredentials: false,
  });
  return data.data;
};
