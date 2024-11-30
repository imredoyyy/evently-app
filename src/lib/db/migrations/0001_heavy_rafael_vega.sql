ALTER TABLE "event" ALTER COLUMN "image" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "event" ADD COLUMN "totalEarnings" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "event" ADD COLUMN "organizerEarnings" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "event" ADD COLUMN "platformsEarnings" numeric(10, 2);