CREATE TABLE "tasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"priority" text,
	"status" text,
	"description" varchar(255),
	"dueDate" date,
	"createdAt" date DEFAULT now() NOT NULL,
	"updatedAt" date NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"pfp" varchar(255) NOT NULL,
	"createdAt" date DEFAULT now() NOT NULL,
	"updatedAt" date NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
