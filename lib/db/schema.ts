import {
  pgTable, uuid, varchar, text, boolean, integer,
  smallint, numeric, date, timestamp, pgEnum, jsonb,
} from 'drizzle-orm/pg-core'

export const serviceCategory = pgEnum('service_category', [
  'company_registration','finance_tax','hr_visa',
  'license_permit','legal','location_rental',
])
export const userRole = pgEnum('user_role', ['admin','sales','ops','accountant'])

export const users = pgTable('users', {
  id:        uuid('id').primaryKey().defaultRandom(),
  email:     varchar('email', { length: 200 }).notNull().unique(),
  name:      varchar('name', { length: 100 }).notNull(),
  password:  varchar('password', { length: 200 }).notNull(),
  role:      userRole('role').notNull().default('sales'),
  isActive:  boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const services = pgTable('services', {
  id:            uuid('id').primaryKey().defaultRandom(),
  name:          varchar('name', { length: 200 }).notNull(),
  category:      serviceCategory('category').notNull(),
  description:   text('description'),
  longDesc:      text('long_desc'),
  highlights:    jsonb('highlights'),
  priceMin:      numeric('price_min', { precision: 12, scale: 2 }),
  priceMax:      numeric('price_max', { precision: 12, scale: 2 }),
  currency:      varchar('currency', { length: 3 }).notNull().default('CNY'),
  estimatedDays: integer('estimated_days'),
  isRecurring:   boolean('is_recurring').notNull().default(false),
  recurCycle:    varchar('recur_cycle', { length: 20 }),
  recurAmount:   numeric('recur_amount', { precision: 12, scale: 2 }),
  isPublished:   boolean('is_published').notNull().default(false),
  sortOrder:     smallint('sort_order').notNull().default(0),
  createdAt:     timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt:     timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export const sopSteps = pgTable('sop_steps', {
  id:           uuid('id').primaryKey().defaultRandom(),
  serviceId:    uuid('service_id').notNull().references(() => services.id, { onDelete: 'cascade' }),
  stepOrder:    smallint('step_order').notNull(),
  title:        varchar('title', { length: 200 }).notNull(),
  description:  text('description'),
  requiredDocs: jsonb('required_docs'),
  assigneeRole: userRole('assignee_role').default('ops'),
  slaDays:      integer('sla_days'),
  createdAt:    timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const inquiries = pgTable('inquiries', {
  id:          uuid('id').primaryKey().defaultRandom(),
  serviceId:   uuid('service_id').references(() => services.id),
  companyName: varchar('company_name', { length: 200 }).notNull(),
  contactName: varchar('contact_name', { length: 100 }).notNull(),
  phone:       varchar('phone', { length: 50 }).notNull(),
  email:       varchar('email', { length: 200 }),
  message:     text('message'),
  isRead:      boolean('is_read').notNull().default(false),
  createdAt:   timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})
