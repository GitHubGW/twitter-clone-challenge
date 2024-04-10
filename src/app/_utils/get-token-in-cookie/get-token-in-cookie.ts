import { RequestCookies } from "next/dist/compiled/@edge-runtime/cookies";

/**
 * 쿠키에서 JSON Web Token을 가져오는 함수
 *
 * @param RequestCookies - 요청 쿠키를 나타내는 객체입니다.
 * @returns JSON Web Token 문자열입니다. 쿠키에서 토큰을 찾지 못한 경우 undefined을 반환합니다.
 */
const getTokenInCookie = (RequestCookies: RequestCookies) => {
  const jsonWebToken = RequestCookies.get("jsonWebToken")?.value;
  return jsonWebToken;
};

export default getTokenInCookie;
