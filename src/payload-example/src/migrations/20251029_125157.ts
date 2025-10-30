import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_roles" AS ENUM('admin', 'creator');
  CREATE TABLE "users_roles" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_users_roles",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "confidential" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "confidential_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"confidential_media_id" integer
  );
  
  CREATE TABLE "confidential_media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer,
  	"confidential_id" integer,
  	"confidential_media_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "users_roles" ADD CONSTRAINT "users_roles_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "confidential_rels" ADD CONSTRAINT "confidential_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."confidential"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "confidential_rels" ADD CONSTRAINT "confidential_rels_confidential_media_fk" FOREIGN KEY ("confidential_media_id") REFERENCES "public"."confidential_media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_confidential_fk" FOREIGN KEY ("confidential_id") REFERENCES "public"."confidential"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_confidential_media_fk" FOREIGN KEY ("confidential_media_id") REFERENCES "public"."confidential_media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_roles_order_idx" ON "users_roles" USING btree ("order");
  CREATE INDEX "users_roles_parent_idx" ON "users_roles" USING btree ("parent_id");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "confidential_updated_at_idx" ON "confidential" USING btree ("updated_at");
  CREATE INDEX "confidential_created_at_idx" ON "confidential" USING btree ("created_at");
  CREATE INDEX "confidential_rels_order_idx" ON "confidential_rels" USING btree ("order");
  CREATE INDEX "confidential_rels_parent_idx" ON "confidential_rels" USING btree ("parent_id");
  CREATE INDEX "confidential_rels_path_idx" ON "confidential_rels" USING btree ("path");
  CREATE INDEX "confidential_rels_confidential_media_id_idx" ON "confidential_rels" USING btree ("confidential_media_id");
  CREATE INDEX "confidential_media_updated_at_idx" ON "confidential_media" USING btree ("updated_at");
  CREATE INDEX "confidential_media_created_at_idx" ON "confidential_media" USING btree ("created_at");
  CREATE UNIQUE INDEX "confidential_media_filename_idx" ON "confidential_media" USING btree ("filename");
  CREATE INDEX "confidential_media_sizes_thumbnail_sizes_thumbnail_filen_idx" ON "confidential_media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_confidential_id_idx" ON "payload_locked_documents_rels" USING btree ("confidential_id");
  CREATE INDEX "payload_locked_documents_rels_confidential_media_id_idx" ON "payload_locked_documents_rels" USING btree ("confidential_media_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");

  INSERT INTO public.users (id, updated_at, created_at, email, reset_password_token, reset_password_expiration, salt, hash, login_attempts, lock_until) VALUES (1, '2025-10-30 08:27:30.836 +00:00', '2025-10-30 08:27:30.834 +00:00', 'admin@payload.test', null, null, 'a2bb3d74bfa39621f3c76e6003c26a9304e09742acb9f02011e46bf1c4b080aa', '9d117dcca263dfcca3000af83f0c68f3f24788735bacb2fb1a782d59e1cc40d3a4d2f90d19281867ebafc526f695672ba08f5797501b1ec791323c54eb2c7cc0f2d4757b2198aca1e89ce3f0d48d02934acccd127bf1fc380491d062bc6d19dfdf27404dc7cb23dbfed791ac762f5aad3aaf8ced10a8a60a3ab100faf4657c80b960d7b11533141950667969b82a9e02cb2b2afb9e00a1fb2ca213ce4b1db1b7fa18ec32b57e2017ed61975209587670b9b088da936a1095acd7405867cdc792323c34c76667ca7693974e8348bbce67c1b1df0d5fcc5bb0a723281f712959ba1cb50072f06ff3a4b89bbf82ca771e6593e78f76e73283e938f5c450ddfe7de3cb7810e74e90ba2e09fd4ae221b6ec94e58103fc2b976a23a683a31bca309dc85d78ad844a2daef3bae880ef9940fa82222c33d27ee9f0e422d5c47f7934d582dd6adc27a2b83d08e0342e65fed644add855bf30bdfd22b2413cc8a97af6eed2567d8c8f89790bf6a461b0ec957b427dc5c3e3c2bd9e3782ce3d17d735eb69cb457a0782e851a1ff660500dcdcf6f8c48fbdc62fae2e96162a9132eef33d697c5f6def2f1474a3d8f9073ee5374b8fb7501b160c25a93db8c16ec0c2fa789331c6de7365a5ec758a9ad13d0c695231d696b74f61431b667659d760a73fca38bfb55003ce7480feeb460321d08f80989aa4ef25924afee5d607091f51a0136984', 0, null);
  INSERT INTO public.users_roles ("order", parent_id, value, id) VALUES (1, 1, 'admin', 2);

  INSERT INTO public.users (id, updated_at, created_at, email, reset_password_token, reset_password_expiration, salt, hash, login_attempts, lock_until) VALUES (2, '2025-10-30 13:48:29.293 +00:00', '2025-10-30 13:48:29.293 +00:00', 'creator@payload.test', null, null, 'c22762573f03253c9a96b831d70ef27270323537fa353ed39a0ce45a2afe7a0d', '3e18804c4056f33600b5f85c180e3981dccd6cafe58462a9a12b3372c88fbfaf20656310a0c7cc889c841708496803cee1f90d14e5998fe5eaecafb9c76971b1691e798ef61f46d3e5b737528274fb0f387081d627cc85add07bd014bf8da39e896d675c3ba5b20f3823c944d0444a1c2d3a98cf7777325d056f28cf7b85a6ff0e6325dbbe83459fc7c8150f2326d13077b38ecd4814de5dadc92f3d47985fc84b2276a24b475667fdb106a8184351ec323af29a8c801c01ed5323ee734fa9de97057f646d7873d8e5ed82be1f606b2807369f3a563d1a22f09d2b05d5e53c30ee733850df3976e53c6d65be6925c322c5ef9378529a92682467ccdff79bb7acd7144ebeeb112cff0379f7f8556fefb362126039170f44fafba8888e0dfef53498385d47b3d688cd2d113eaacea56c1d03136e49cc7042cd64fca18b857f5bf472fd67ab1afaf6ad4a38de31988878f3eadc314adccc3280b3b6e7b294d91977264035dc926a7e54992ab17159707c0c1808ea50b1ae3764b210b12814312073563e5ad31c4905994e9addc862f0ec8e6b01fc62c1d6291830719e7733ed2fd930d6be41953f2f9ef7164efa67e24d49db3cb83f120bc6307d17961f865d061ac46e2351ba81628c157edaf2e2348c102bb626cf51fda9fcee0f7cd0fa585ffc218cdeec25ec0dab4901eba9689a9a4b2f64fa39b0e01fa150b8ec051081acad', 0, null);
  INSERT INTO public.users_roles ("order", parent_id, value, id) VALUES (1, 2, 'creator', 3);
`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_roles" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "confidential" CASCADE;
  DROP TABLE "confidential_rels" CASCADE;
  DROP TABLE "confidential_media" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TYPE "public"."enum_users_roles";`)
}
