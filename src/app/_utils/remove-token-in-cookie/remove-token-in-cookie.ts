import Cookies from "js-cookie";

/**
 * "jsonWebToken" 쿠키를 제거하는 함수
 */
const removeTokenInCookie = () => {
  Cookies.remove("jsonWebToken");
};

export default removeTokenInCookie;
