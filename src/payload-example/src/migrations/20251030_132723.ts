import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "_confidential_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_description" jsonb,
  	"version_last_edited_by_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_confidential_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"confidential_media_id" integer
  );
  
  ALTER TABLE "confidential" ADD COLUMN "last_edited_by_id" integer;
  ALTER TABLE "_confidential_v" ADD CONSTRAINT "_confidential_v_parent_id_confidential_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."confidential"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_confidential_v" ADD CONSTRAINT "_confidential_v_version_last_edited_by_id_users_id_fk" FOREIGN KEY ("version_last_edited_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_confidential_v_rels" ADD CONSTRAINT "_confidential_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_confidential_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_confidential_v_rels" ADD CONSTRAINT "_confidential_v_rels_confidential_media_fk" FOREIGN KEY ("confidential_media_id") REFERENCES "public"."confidential_media"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "_confidential_v_parent_idx" ON "_confidential_v" USING btree ("parent_id");
  CREATE INDEX "_confidential_v_version_version_last_edited_by_idx" ON "_confidential_v" USING btree ("version_last_edited_by_id");
  CREATE INDEX "_confidential_v_version_version_updated_at_idx" ON "_confidential_v" USING btree ("version_updated_at");
  CREATE INDEX "_confidential_v_version_version_created_at_idx" ON "_confidential_v" USING btree ("version_created_at");
  CREATE INDEX "_confidential_v_created_at_idx" ON "_confidential_v" USING btree ("created_at");
  CREATE INDEX "_confidential_v_updated_at_idx" ON "_confidential_v" USING btree ("updated_at");
  CREATE INDEX "_confidential_v_rels_order_idx" ON "_confidential_v_rels" USING btree ("order");
  CREATE INDEX "_confidential_v_rels_parent_idx" ON "_confidential_v_rels" USING btree ("parent_id");
  CREATE INDEX "_confidential_v_rels_path_idx" ON "_confidential_v_rels" USING btree ("path");
  CREATE INDEX "_confidential_v_rels_confidential_media_id_idx" ON "_confidential_v_rels" USING btree ("confidential_media_id");
  ALTER TABLE "confidential" ADD CONSTRAINT "confidential_last_edited_by_id_users_id_fk" FOREIGN KEY ("last_edited_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "confidential_last_edited_by_idx" ON "confidential" USING btree ("last_edited_by_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "_confidential_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_confidential_v_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "_confidential_v" CASCADE;
  DROP TABLE "_confidential_v_rels" CASCADE;
  ALTER TABLE "confidential" DROP CONSTRAINT "confidential_last_edited_by_id_users_id_fk";
  
  DROP INDEX "confidential_last_edited_by_idx";
  ALTER TABLE "confidential" DROP COLUMN "last_edited_by_id";`)
}
