import { defineMiddleware } from "astro/middleware";
import jwt from "jsonwebtoken";

export const prerender = false;
const USERNAME = import.meta.env.USERNAME;
const SECRET_KEY = import.meta.env.SECRET_KEY;
const IS_PUBLIC = import.meta.env.IS_PUBLIC == 1 ? true : false;

export const onRequest = defineMiddleware(async (context, next) => {
  const { url, cookies, redirect } = context;
  let access_token = cookies.get("access_token")?.value;
  let user = cookies.get("user")?.value;
  if (access_token) {
    try {
      const decoded = jwt.verify(access_token, SECRET_KEY);

      if (decoded.email !== USERNAME) {
        access_token = null;
        user = null;
        cookies.delete("access_token", { path: "/" });
        cookies.delete("user", { path: "/" });
      }
    } catch (err) {
      access_token = null;
      user = null;
      cookies.delete("access_token", { path: "/" });
      cookies.delete("user", { path: "/" });
    }
  }

  console.log("url.pathname", url.pathname);

  /* CHECK AUTH STATUS */
  if (url.pathname.endsWith("/admin")) {
    if (!access_token || !user || user !== USERNAME) return redirect("/login");
  }

  console.log(url.pathname, IS_PUBLIC, access_token);

  if (
    (url.pathname.startsWith("/qr") && !IS_PUBLIC && !access_token)
  ) { 
    return redirect("/404");
  }

  if (url.pathname.startsWith("/login")) {
    let access_token = cookies.get("access_token")?.value;
    if (access_token && user === USERNAME) return redirect("/admin");
  }

  if (url.pathname.startsWith("/logout")) {
    if (access_token) {
      cookies.delete("access_token", { path: "/" });
      cookies.delete("access_token", { path: "/" });
    }
    return redirect("/login");
  }

  const response = await next();
  return response;
});
