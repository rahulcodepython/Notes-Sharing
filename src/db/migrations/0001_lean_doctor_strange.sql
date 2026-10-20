DROP INDEX "invitation_community_id_index";--> statement-breakpoint
ALTER TABLE "invitation" DROP COLUMN "id";--> statement-breakpoint
ALTER TABLE "invitation" ADD PRIMARY KEY ("community_id");--> statement-breakpoint
ALTER TABLE "invitation" ALTER COLUMN "expires_at" SET NOT NULL;
