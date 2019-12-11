import Cookies from "js-cookie";
import ls from "local-storage";
import passwordValidator from "password-validator";
import emailValidator from "email-validator";

export const setAuthenticationToken = accessToken => {
  return new Promise((resolve, reject) => {
    ls.remove("adso-token");
    ls.set("adso-token", accessToken);
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

export const validateEmail = email => {
  return emailValidator.validate(email);
};

export const validatePassword = password => {
  let schema = new passwordValidator();

  schema
    .is()
    .min(8)
    .is()
    .max(20)
    .has()
    .not()
    .spaces();

  return schema.validate(password);
};
