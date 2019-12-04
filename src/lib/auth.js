import Cookies from "js-cookie";
import ls from "local-storage";

export const setAuthenticationToken = accessToken => {
  ls.remove("adso-token");
  ls.set("adso-token", accessToken);
};

export const setRefreshToken = refreshToken => {
  Cookies.remove("adso_qid");
  Cookies.set("adso_qid", refreshToken);
};
