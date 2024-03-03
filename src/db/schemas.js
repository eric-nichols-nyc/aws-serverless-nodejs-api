// this is where we define the schema for our database

const { serial } = require("drizzle-orm/mysql-core");
const { text, timestamp, pgTable } = require("drizzle-orm/pg-core");

const LeadTable = pgTable('leads', {
  id: serial('id').primaryKey().notNull(),
  email: text('email').notNull(),
  description: text('description').default('This is my comment'),
  createdAt: timestamp('created_at').defaultNow(),
});

// bring this into the database wi migration
module.exports.LeadTable = LeadTable