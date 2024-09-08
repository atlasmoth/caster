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

export const pollSubscription = async (key: string) => {
  let count = 0;

  while (count < 30) {
    count++;
    await sleep(5000);
    try {
      const userData = await whoAmI(key);
      if (userData.data) {
        return true;
      }
    } catch (error) {
      console.log(error);
    }
  }

  return false;
};

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
