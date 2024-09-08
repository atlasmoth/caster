import axios from "axios";

export const BASE_URL = "https://capi.backpack.network";

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
