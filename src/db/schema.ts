import {
  bigint,
  boolean,
  index,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";

const createdAt = () => timestamp({ withTimezone: true }).notNull().defaultNow();
const updatedAt = () =>
  timestamp({ withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date());

// better-auth core tables

export const user = pgTable("user", {
  id: text().primaryKey(),
  name: text().notNull(),
  email: text().notNull().unique(),
  emailVerified: boolean().notNull().default(false),
  image: text(),
  driveFolderId: text(),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export const session = pgTable(
  "session",
  {
    id: text().primaryKey(),
    expiresAt: timestamp({ withTimezone: true }).notNull(),
    token: text().notNull().unique(),
    ipAddress: text(),
    userAgent: text(),
    userId: text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [index().on(t.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text().primaryKey(),
    accountId: text().notNull(),
    providerId: text().notNull(),
    userId: text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text(),
    refreshToken: text(),
    idToken: text(),
    accessTokenExpiresAt: timestamp({ withTimezone: true }),
    refreshTokenExpiresAt: timestamp({ withTimezone: true }),
    scope: text(),
    password: text(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [index().on(t.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: text().primaryKey(),
    identifier: text().notNull(),
    value: text().notNull(),
    expiresAt: timestamp({ withTimezone: true }).notNull(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [index().on(t.identifier)],
);

// app tables

export const communityAccess = pgEnum("community_access", ["open", "request", "private"]);

export const community = pgTable("community", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  slug: text().notNull().unique(),
  description: text(),
  access: communityAccess().notNull().default("open"),
  ownerId: text()
    .notNull()
    .references(() => user.id),
  createdAt: createdAt(),
});

export const communityMember = pgTable(
  "community_member",
  {
    communityId: uuid()
      .notNull()
      .references(() => community.id, { onDelete: "cascade" }),
    userId: text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    joinedAt: createdAt(),
  },
  (t) => [primaryKey({ columns: [t.communityId, t.userId] }), index().on(t.userId)],
);

export const joinRequest = pgTable(
  "join_request",
  {
    communityId: uuid()
      .notNull()
      .references(() => community.id, { onDelete: "cascade" }),
    userId: text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: createdAt(),
  },
  (t) => [primaryKey({ columns: [t.communityId, t.userId] })],
);

// One active invite link per community. Regenerating replaces the token.
export const invitation = pgTable("invitation", {
  communityId: uuid()
    .primaryKey()
    .references(() => community.id, { onDelete: "cascade" }),
  token: text().notNull().unique(),
  createdBy: text()
    .notNull()
    .references(() => user.id),
  expiresAt: timestamp({ withTimezone: true }).notNull(),
  createdAt: createdAt(),
});

export const category = pgTable(
  "category",
  {
    id: uuid().primaryKey().defaultRandom(),
    communityId: uuid()
      .notNull()
      .references(() => community.id, { onDelete: "cascade" }),
    name: text().notNull(),
    createdBy: text()
      .notNull()
      .references(() => user.id),
    createdAt: createdAt(),
  },
  (t) => [unique().on(t.communityId, t.name)],
);

export const note = pgTable(
  "note",
  {
    id: uuid().primaryKey().defaultRandom(),
    communityId: uuid()
      .notNull()
      .references(() => community.id, { onDelete: "cascade" }),
    categoryId: uuid()
      .notNull()
      .references(() => category.id),
    uploaderId: text()
      .notNull()
      .references(() => user.id),
    title: text().notNull(),
    driveFileId: text().notNull(),
    driveUrl: text().notNull(),
    mimeType: text().notNull(),
    size: bigint({ mode: "number" }).notNull(),
    createdAt: createdAt(),
  },
  (t) => [index().on(t.communityId, t.createdAt), index().on(t.categoryId), index().on(t.uploaderId)],
);

export const noteDownload = pgTable(
  "note_download",
  {
    id: uuid().primaryKey().defaultRandom(),
    noteId: uuid()
      .notNull()
      .references(() => note.id, { onDelete: "cascade" }),
    userId: text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: createdAt(),
  },
  (t) => [index().on(t.noteId), index().on(t.createdAt)],
);
