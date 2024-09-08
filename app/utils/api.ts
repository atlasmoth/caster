import axios from "axios";

export const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

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

export const pollSubscription = async (key: string) => {
  let count = 0;

  while (count < 30) {
    try {
      const userData = await whoAmI(key);
      if (userData.data) {
        return true;
      }
      await sleep(2000);
      count++;
    } catch (error) {
      console.log(error);
    }
  }

  return false;
};

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
