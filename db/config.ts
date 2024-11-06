import { defineDb, defineTable, column, NOW } from 'astro:db';

const Links = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    slug: column.text(),
    href: column.text(),
    hits: column.number({default:0}),
    date: column.date({ default: NOW }),
  },
  indexes: [
    { on: ["id", "slug"], unique: true },
  ]
})

export default defineDb({
  tables: { Links },
})