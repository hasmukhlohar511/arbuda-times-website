CREATE TABLE `products` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`sku` text NOT NULL,
	`category` text NOT NULL,
	`description` text NOT NULL,
	`price` real NOT NULL,
	`moq` integer NOT NULL,
	`increment` integer NOT NULL,
	`dial_colour` text NOT NULL,
	`strap_material` text NOT NULL,
	`variants` text NOT NULL,
	`stock_status` text NOT NULL,
	`featured` integer DEFAULT false NOT NULL,
	`new_arrival` integer DEFAULT false NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`archived` integer DEFAULT false NOT NULL,
	`cover_image` text,
	`images` text DEFAULT '[]' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `products_sku_unique` ON `products` (`sku`);--> statement-breakpoint
CREATE TABLE `settings` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL,
	`updated_at` integer NOT NULL
);
