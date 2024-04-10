import { NextRequest, NextResponse } from "next/server";
import { getTokenInCookie } from "./app/_utils/get-token-in-cookie";

const middleware = (request: NextRequest) => {
  const jsonWebToken = getTokenInCookie(request.cookies);

  if (jsonWebToken) {
    return NextResponse.next();
  }

  return NextResponse.redirect("http://localhost:3000/login");
};

export default middleware;

export const config = {
  matcher: ["/submit", "/posts/:postId/edit"],
};
