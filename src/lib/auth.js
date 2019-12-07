import Cookies from "js-cookie";
import ls from "local-storage";

export const setAuthenticationToken = accessToken => {
  return new Promise((resolve, reject) => {
    ls.remove("adso-token");
    ls.set("adso-token", accessToken);
    console.log("Setting token", accessToken);
    return resolve(true);
  });
};

export const setRefreshToken = refreshToken => {
  Cookies.remove("adso_qid");
  Cookies.set("adso_qid", refreshToken);
};

export const clearTokens = () => {
  Cookies.remove("adso_qid");
  ls.remove("adso-token");
};
