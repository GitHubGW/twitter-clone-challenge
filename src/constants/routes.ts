const ROUTES = {
  HOME: "/",
  ALL: "/all",
  LOGIN: "/login",
  SIGN_UP: "/sign-up",
  POPULAR: "/popular",
  SUBMIT: "/submit",
  RESET_PASSWORD: "/reset-password",
  USER_DETAIL: (userId: string | undefined) => `/users/${userId}`,
  POST_DETAIL: (postId: string) => `/posts/${postId}`,
  POST_EDIT: (postId: string) => `/posts/${postId}/edit`,
};

export default ROUTES;
