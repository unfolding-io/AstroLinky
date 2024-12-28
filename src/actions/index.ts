import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import jwt from "jsonwebtoken";

import { db, Links, eq } from "astro:db";

const USERNAME = import.meta.env.USERNAME;
const PASSWORD = import.meta.env.PASSWORD;
const SECRET_KEY = import.meta.env.SECRET_KEY;

export const server = {
  addLink: defineAction({
    input: z.object({
      slug: z.string(),
      href: z.string(),
    }),
    handler: async ({ slug, href }) => {
      try {
        if (typeof slug === "string" && typeof href === "string") {
          await db.insert(Links).values({ slug, href });
          const links = await db.select().from(Links);
          return links.reverse();
        }
      } catch (error: any) {
        console.error("DB error:", error);

        return {
          status: "error",
          message: "An error occurred",
        };
      }
    },
  }),
  addLinkPublic: defineAction({
    input: z.object({
      slug: z.string(),
      href: z.string(),
    }),
    handler: async ({ slug, href }) => {
      try {
        if (typeof slug === "string" && typeof href === "string") {
          const existingLink = await db
            .select()
            .from(Links)
            .where(eq(Links.slug, slug))
            .get();
          if (existingLink) {
            return {
              status: "error",
              message: "Slug already exists",
            };
          }
          await db.insert(Links).values({ slug, href });

          return {
            status: "success",
            slug: slug,
            href: href,
            message: "Link added successfully",
          };
        }
      } catch (error: any) {
        console.error("DB error:", error?.status);

        return {
          status: "error",
          message: "An error occurred",
        };
      }
    },
  }),
  getLinks: defineAction({
    handler: async () => {
      try {
        const links = await db.select().from(Links);

        return links.reverse();
      } catch (error: any) {
        console.error("error:", error);

        return {
          status: "error",
          message: "An error occurred",
        };
      }
    },
  }),
  getLink: defineAction({
    accept: "json",
    input: z.object({
      slug: z.string(),
    }),
    handler: async ({ slug }) => {
      try {
        const link = await db.select().from(Links).where(eq(Links.slug, slug));

        return link.pop();
      } catch (error: any) {
        console.error("error:", error);

        return {
          status: "error",
          message: "An error occurred",
        };
      }
    },
  }),
  removeLink: defineAction({
    input: z.object({
      slug: z.string(),
    }),
    handler: async ({ slug }) => {
      try {
        await db.delete(Links).where(eq(Links.slug, slug));
        const links = await db.select().from(Links);
        return links.reverse();
      } catch (error: any) {
        console.error("error:", error);

        return {
          status: "error",
          message: "An error occurred",
        };
      }
    },
  }),
  login: defineAction({
    input: z.object({
      email: z.string(),
      password: z.string(),
    }),
    handler: async ({ email, password }, ctx) => {
      try {
        if (email === USERNAME && password === PASSWORD) {
          const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: "1d" });

          ctx.cookies.set("access_token", token, {
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
            path: "/",
            httpOnly: true, // Prevents client-side scripts from accessing the cookie
            secure: process.env.NODE_ENV === "production", // Ensures the cookie is only sent over HTTPS in production
            sameSite: "strict",
          });
          ctx.cookies.set("user", email, {
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
            path: "/",
            httpOnly: true, // Prevents client-side scripts from accessing the cookie
            secure: process.env.NODE_ENV === "production", // Ensures the cookie is only sent over HTTPS in production
            sameSite: "strict",
          });
          return {
            status: "success",
            message: "Login successful",
          };
        } else {
          return {
            status: "error",
            message: "Invalid credentials",
          };
        }
      } catch (error: any) {
        console.error("error:", error);

        return {
          status: "error",
          message: "An error occurred",
        };
      }
    },
  }),
};
