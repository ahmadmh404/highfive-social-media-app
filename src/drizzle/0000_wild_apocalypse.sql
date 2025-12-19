CREATE TYPE "public"."friendship_status" AS ENUM('pending', 'accepted', 'blocked');--> statement-breakpoint
CREATE TYPE "public"."media_type" AS ENUM('image', 'video', 'audio', 'document');--> statement-breakpoint
CREATE TYPE "public"."notification_type" AS ENUM('like', 'comment', 'follow', 'friend_request', 'message', 'post_mention');--> statement-breakpoint
CREATE TYPE "public"."post_privacy" AS ENUM('public', 'friends', 'private');--> statement-breakpoint
CREATE TYPE "public"."reaction_type" AS ENUM('like', 'love', 'haha', 'sad', 'angry');--> statement-breakpoint
CREATE TABLE "highfive_audit_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid,
	"action" varchar(100) NOT NULL,
	"resource" varchar(100) NOT NULL,
	"resource_id" uuid,
	"changes" json,
	"ip_address" varchar(45),
	"user_agent" text,
	"status_code" smallint,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "highfive_bookmarks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"post_id" uuid NOT NULL,
	"collection_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "highfive_collections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"is_public" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "highfive_comment_reactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"comment_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"type" "reaction_type" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "highfive_comments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"post_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "highfive_conversations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"participant_ids" json NOT NULL,
	"is_group" boolean DEFAULT false,
	"group_name" varchar(255),
	"group_avatar" text,
	"last_message_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "highfive_followers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"follower_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "highfive_friendships" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"friend_id" uuid NOT NULL,
	"status" "friendship_status" DEFAULT 'pending' NOT NULL,
	"requested_at" timestamp DEFAULT now(),
	"accepted_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "highfive_media" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"post_id" uuid,
	"story_id" uuid,
	"message_id" uuid,
	"uploadthing_key" text NOT NULL,
	"uploadthing_url" text NOT NULL,
	"type" "media_type" NOT NULL,
	"mime_type" varchar(100),
	"size" integer,
	"duration" integer,
	"width" integer,
	"height" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "highfive_media_uploadthing_key_unique" UNIQUE("uploadthing_key")
);
--> statement-breakpoint
CREATE TABLE "highfive_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"conversation_id" uuid NOT NULL,
	"sender_id" uuid NOT NULL,
	"content" text,
	"media_ids" json,
	"read_by" json DEFAULT '{}'::json,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "highfive_notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"type" "notification_type" NOT NULL,
	"related_user_id" uuid,
	"related_post_id" uuid,
	"related_comment_id" uuid,
	"message" text,
	"is_read" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "highfive_post_reactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"post_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"type" "reaction_type" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "highfive_posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"content" text NOT NULL,
	"privacy" "post_privacy" DEFAULT 'public' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "highfive_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"token" text NOT NULL,
	"user_agent" text,
	"ip_address" varchar(45),
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "highfive_sessions_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "highfive_stories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"content" text NOT NULL,
	"media_ids" json,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "highfive_story_views" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"story_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"viewed_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "highfive_tags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"post_id" uuid,
	"comment_id" uuid,
	"tagged_user_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "highfive_users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"username" varchar(100) NOT NULL,
	"password_hash" text NOT NULL,
	"full_name" varchar(255),
	"bio" text,
	"avatar" text,
	"cover_image" text,
	"is_email_verified" boolean DEFAULT false,
	"is_verified" boolean DEFAULT false,
	"is_active" boolean DEFAULT true,
	"last_login_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "highfive_users_email_unique" UNIQUE("email"),
	CONSTRAINT "highfive_users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "highfive_audit_logs" ADD CONSTRAINT "highfive_audit_logs_user_id_highfive_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."highfive_users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "highfive_bookmarks" ADD CONSTRAINT "highfive_bookmarks_user_id_highfive_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."highfive_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "highfive_bookmarks" ADD CONSTRAINT "highfive_bookmarks_post_id_highfive_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."highfive_posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "highfive_bookmarks" ADD CONSTRAINT "highfive_bookmarks_collection_id_highfive_collections_id_fk" FOREIGN KEY ("collection_id") REFERENCES "public"."highfive_collections"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "highfive_collections" ADD CONSTRAINT "highfive_collections_user_id_highfive_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."highfive_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "highfive_comment_reactions" ADD CONSTRAINT "highfive_comment_reactions_comment_id_highfive_comments_id_fk" FOREIGN KEY ("comment_id") REFERENCES "public"."highfive_comments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "highfive_comment_reactions" ADD CONSTRAINT "highfive_comment_reactions_user_id_highfive_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."highfive_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "highfive_comments" ADD CONSTRAINT "highfive_comments_post_id_highfive_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."highfive_posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "highfive_comments" ADD CONSTRAINT "highfive_comments_user_id_highfive_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."highfive_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "highfive_followers" ADD CONSTRAINT "highfive_followers_user_id_highfive_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."highfive_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "highfive_followers" ADD CONSTRAINT "highfive_followers_follower_id_highfive_users_id_fk" FOREIGN KEY ("follower_id") REFERENCES "public"."highfive_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "highfive_friendships" ADD CONSTRAINT "highfive_friendships_user_id_highfive_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."highfive_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "highfive_friendships" ADD CONSTRAINT "highfive_friendships_friend_id_highfive_users_id_fk" FOREIGN KEY ("friend_id") REFERENCES "public"."highfive_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "highfive_media" ADD CONSTRAINT "highfive_media_user_id_highfive_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."highfive_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "highfive_media" ADD CONSTRAINT "highfive_media_post_id_highfive_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."highfive_posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "highfive_media" ADD CONSTRAINT "highfive_media_story_id_highfive_stories_id_fk" FOREIGN KEY ("story_id") REFERENCES "public"."highfive_stories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "highfive_media" ADD CONSTRAINT "highfive_media_message_id_highfive_messages_id_fk" FOREIGN KEY ("message_id") REFERENCES "public"."highfive_messages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "highfive_messages" ADD CONSTRAINT "highfive_messages_conversation_id_highfive_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."highfive_conversations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "highfive_messages" ADD CONSTRAINT "highfive_messages_sender_id_highfive_users_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."highfive_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "highfive_notifications" ADD CONSTRAINT "highfive_notifications_user_id_highfive_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."highfive_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "highfive_notifications" ADD CONSTRAINT "highfive_notifications_related_user_id_highfive_users_id_fk" FOREIGN KEY ("related_user_id") REFERENCES "public"."highfive_users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "highfive_notifications" ADD CONSTRAINT "highfive_notifications_related_post_id_highfive_posts_id_fk" FOREIGN KEY ("related_post_id") REFERENCES "public"."highfive_posts"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "highfive_notifications" ADD CONSTRAINT "highfive_notifications_related_comment_id_highfive_comments_id_fk" FOREIGN KEY ("related_comment_id") REFERENCES "public"."highfive_comments"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "highfive_post_reactions" ADD CONSTRAINT "highfive_post_reactions_post_id_highfive_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."highfive_posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "highfive_post_reactions" ADD CONSTRAINT "highfive_post_reactions_user_id_highfive_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."highfive_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "highfive_posts" ADD CONSTRAINT "highfive_posts_user_id_highfive_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."highfive_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "highfive_sessions" ADD CONSTRAINT "highfive_sessions_user_id_highfive_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."highfive_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "highfive_stories" ADD CONSTRAINT "highfive_stories_user_id_highfive_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."highfive_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "highfive_story_views" ADD CONSTRAINT "highfive_story_views_story_id_highfive_stories_id_fk" FOREIGN KEY ("story_id") REFERENCES "public"."highfive_stories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "highfive_story_views" ADD CONSTRAINT "highfive_story_views_user_id_highfive_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."highfive_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "highfive_tags" ADD CONSTRAINT "highfive_tags_post_id_highfive_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."highfive_posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "highfive_tags" ADD CONSTRAINT "highfive_tags_comment_id_highfive_comments_id_fk" FOREIGN KEY ("comment_id") REFERENCES "public"."highfive_comments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "highfive_tags" ADD CONSTRAINT "highfive_tags_tagged_user_id_highfive_users_id_fk" FOREIGN KEY ("tagged_user_id") REFERENCES "public"."highfive_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "highfive_audit_logs_user_id_index" ON "highfive_audit_logs" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "highfive_audit_logs_action_index" ON "highfive_audit_logs" USING btree ("action");--> statement-breakpoint
CREATE INDEX "highfive_audit_logs_resource_index" ON "highfive_audit_logs" USING btree ("resource");--> statement-breakpoint
CREATE INDEX "highfive_audit_logs_created_at_index" ON "highfive_audit_logs" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "highfive_bookmarks_user_id_index" ON "highfive_bookmarks" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "highfive_bookmarks_post_id_index" ON "highfive_bookmarks" USING btree ("post_id");--> statement-breakpoint
CREATE INDEX "highfive_bookmarks_collection_id_index" ON "highfive_bookmarks" USING btree ("collection_id");--> statement-breakpoint
CREATE INDEX "highfive_collections_user_id_index" ON "highfive_collections" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "highfive_comment_reactions_comment_id_index" ON "highfive_comment_reactions" USING btree ("comment_id");--> statement-breakpoint
CREATE INDEX "highfive_comment_reactions_user_id_index" ON "highfive_comment_reactions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "highfive_comments_post_id_index" ON "highfive_comments" USING btree ("post_id");--> statement-breakpoint
CREATE INDEX "highfive_comments_user_id_index" ON "highfive_comments" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "highfive_comments_deleted_at_index" ON "highfive_comments" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "highfive_conversations_created_at_index" ON "highfive_conversations" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "highfive_followers_user_id_index" ON "highfive_followers" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "highfive_followers_follower_id_index" ON "highfive_followers" USING btree ("follower_id");--> statement-breakpoint
CREATE UNIQUE INDEX "highfive_followers_user_id_follower_id_index" ON "highfive_followers" USING btree ("user_id","follower_id");--> statement-breakpoint
CREATE INDEX "highfive_friendships_user_id_index" ON "highfive_friendships" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "highfive_friendships_friend_id_index" ON "highfive_friendships" USING btree ("friend_id");--> statement-breakpoint
CREATE INDEX "highfive_friendships_status_index" ON "highfive_friendships" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "highfive_friendships_user_id_friend_id_index" ON "highfive_friendships" USING btree ("user_id","friend_id");--> statement-breakpoint
CREATE INDEX "highfive_media_user_id_index" ON "highfive_media" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "highfive_media_post_id_index" ON "highfive_media" USING btree ("post_id");--> statement-breakpoint
CREATE INDEX "highfive_media_story_id_index" ON "highfive_media" USING btree ("story_id");--> statement-breakpoint
CREATE INDEX "highfive_media_message_id_index" ON "highfive_media" USING btree ("message_id");--> statement-breakpoint
CREATE INDEX "highfive_messages_conversation_id_index" ON "highfive_messages" USING btree ("conversation_id");--> statement-breakpoint
CREATE INDEX "highfive_messages_sender_id_index" ON "highfive_messages" USING btree ("sender_id");--> statement-breakpoint
CREATE INDEX "highfive_messages_created_at_index" ON "highfive_messages" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "highfive_messages_deleted_at_index" ON "highfive_messages" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "highfive_notifications_user_id_index" ON "highfive_notifications" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "highfive_notifications_is_read_index" ON "highfive_notifications" USING btree ("is_read");--> statement-breakpoint
CREATE INDEX "highfive_notifications_created_at_index" ON "highfive_notifications" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "highfive_post_reactions_post_id_index" ON "highfive_post_reactions" USING btree ("post_id");--> statement-breakpoint
CREATE INDEX "highfive_post_reactions_user_id_index" ON "highfive_post_reactions" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "highfive_post_reactions_post_id_user_id_index" ON "highfive_post_reactions" USING btree ("post_id","user_id");--> statement-breakpoint
CREATE INDEX "highfive_posts_user_id_index" ON "highfive_posts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "highfive_posts_privacy_index" ON "highfive_posts" USING btree ("privacy");--> statement-breakpoint
CREATE INDEX "highfive_posts_created_at_index" ON "highfive_posts" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "highfive_posts_deleted_at_index" ON "highfive_posts" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "highfive_sessions_user_id_index" ON "highfive_sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "highfive_sessions_expires_at_index" ON "highfive_sessions" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "highfive_stories_user_id_index" ON "highfive_stories" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "highfive_stories_expires_at_index" ON "highfive_stories" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "highfive_story_views_story_id_index" ON "highfive_story_views" USING btree ("story_id");--> statement-breakpoint
CREATE INDEX "highfive_story_views_user_id_index" ON "highfive_story_views" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "highfive_tags_post_id_index" ON "highfive_tags" USING btree ("post_id");--> statement-breakpoint
CREATE INDEX "highfive_tags_comment_id_index" ON "highfive_tags" USING btree ("comment_id");--> statement-breakpoint
CREATE INDEX "highfive_tags_tagged_user_id_index" ON "highfive_tags" USING btree ("tagged_user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "highfive_users_email_index" ON "highfive_users" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "highfive_users_username_index" ON "highfive_users" USING btree ("username");--> statement-breakpoint
CREATE INDEX "highfive_users_created_at_index" ON "highfive_users" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "highfive_users_is_active_index" ON "highfive_users" USING btree ("is_active");