import Cookies from "js-cookie";

/**
 * "jsonWebToken"이라는 이름의 쿠키에 제공된 JSON 웹 토큰을 설정하는 함수
 * @param jsonWebToken - 쿠키에 설정할 JSON 웹 토큰입니다.
 */
const setTokenInCookie = (jsonWebToken: string) => {
  Cookies.set("jsonWebToken", jsonWebToken);
};

export default setTokenInCookie;
