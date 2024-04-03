import { NextRequest, NextResponse } from "next/server";

const middleware = (request: NextRequest) => {
  return NextResponse.next();
};

export const config = {
  matcher: [],
};

export default middleware;
