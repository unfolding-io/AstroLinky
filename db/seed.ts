import { db, Links } from 'astro:db';

export default async function() {
  await db.insert(Links).values([
    {  slug: "dev", href: "https://unfolding.io" },
    {  slug: "build", href: "https://astro.build" },
    {  slug: "x", href: "https://x.com/unfolding_io" },
    {  slug: "insta", href: "https://www.instagram.com/unfolding.io/" },
    {  slug: "rick", href: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
    {  slug: "theme", href: "https://unfolding.io/work/free-astro-themes/" },
    {  slug: "ld", href: "https://www.linkedin.com/in/preetamslot/" },
    {  slug: "search", href: "https://astro.build" },
    {  slug: "Links", href: "https://astro.build" },
  ]);


}