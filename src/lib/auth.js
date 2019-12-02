import Cookies from "js-cookie";
import ls from "local-storage";

export const setAuthenticationTokens = ({ accessToken, refreshToken }) => {
  console.log("saving auth tokens");
  ls.remove("adso-token");
  ls.set("adso-token", accessToken);
  Cookies.remove("adso_qid");
  Cookies.set("adso_qid", refreshToken);
};
