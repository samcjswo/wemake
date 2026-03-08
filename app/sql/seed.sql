-- seed.sql
-- Uses profile_id '6bb57bc9-6cd2-4a9c-97b5-4df83102f4c8' for all profile_id columns.
-- Profile table is not seeded (assumed to exist e.g. from auth).
-- Insert order respects foreign key dependencies.
-- Run with: psql $DATABASE_URL -f app/sql/seed.sql

-- For psql variable (optional): \set profile_id '6bb57bc9-6cd2-4a9c-97b5-4df83102f4c8'
-- Using literal below so this works with any SQL client.

-- =============================================================================
-- 1. jobs (no FKs)
-- =============================================================================
INSERT INTO jobs (company_name, company_logo_url, title, job_type, position_location, salary_range, location, description, responsibilities, requirements, apply_url)
VALUES
  ('Acme Corp', 'https://example.com/logos/acme.png', 'Senior Frontend Engineer', 'full_time', 'Remote', '$120k–$160k', 'San Francisco, CA', 'Build the future of web apps.', ARRAY['Lead React projects', 'Mentor juniors'], ARRAY['5+ years React', 'TypeScript'], 'https://acme.com/careers/1'),
  ('Beta Inc', 'https://example.com/logos/beta.png', 'Backend Developer', 'full_time', 'Hybrid', '$100k–$140k', 'New York, NY', 'Scale our API and services.', ARRAY['Design APIs', 'Write tests'], ARRAY['Node.js', 'PostgreSQL'], 'https://beta.com/jobs/1'),
  ('Gamma Labs', 'https://example.com/logos/gamma.png', 'Product Designer', 'full_time', 'On-site', '$90k–$130k', 'Austin, TX', 'Shape product experience.', ARRAY['User research', 'Prototyping'], ARRAY['Figma', '3+ years'], 'https://gamma.com/design'),
  ('Delta Software', 'https://example.com/logos/delta.png', 'DevOps Engineer', 'contract', 'Remote', '$80–$120/hr', 'Anywhere', 'Own CI/CD and infra.', ARRAY['Kubernetes', 'Terraform'], ARRAY['AWS', 'Docker'], NULL),
  ('Epsilon Co', 'https://example.com/logos/epsilon.png', 'Full Stack Engineer', 'full_time', 'Remote', '$110k–$150k', 'Seattle, WA', 'End-to-end feature ownership.', ARRAY['Full stack features', 'Code review'], ARRAY['React', 'Python', 'SQL'], 'https://epsilon.com/apply');

-- =============================================================================
-- 2. categories (no FKs)
-- =============================================================================
INSERT INTO categories (name, description)
VALUES
  ('Productivity', 'Tools to get more done'),
  ('Developer Tools', 'Software for developers'),
  ('Design', 'Design and prototyping'),
  ('Marketing', 'Grow and measure'),
  ('AI & ML', 'Artificial intelligence');

-- =============================================================================
-- 3. ideas (claimed_by nullable; no profile seed)
-- =============================================================================
INSERT INTO ideas (title, view_count, like_count, claimed_at, claimed_by)
VALUES
  ('AI-powered code review bot', 120, 15, NULL, NULL),
  ('No-code form builder for startups', 89, 8, NULL, NULL),
  ('Dev-focused newsletter digest', 234, 42, NULL, NULL),
  ('Team standup async video tool', 56, 5, NULL, NULL),
  ('API changelog and version tracker', 178, 22, NULL, NULL);

-- =============================================================================
-- 4. products (profile_id, category_id)
-- =============================================================================
INSERT INTO products (name, tagline, description, how_it_works, icon, url, stats, profile_id, category_id)
VALUES
  ('ShipFast', 'Launch in days', 'Bootstrap your SaaS quickly.', 'Add your idea and we generate the app.', 'https://example.com/icons/ship.png', 'https://shipfast.demo', '{"views": 100, "reviews": 10}', '6bb57bc9-6cd2-4a9c-97b5-4df83102f4c8'::uuid, 1),
  ('DBVisual', 'See your data', 'Visualize and query any DB.', 'Connect and explore with a UI.', 'https://example.com/icons/db.png', 'https://dbvisual.demo', '{"views": 200, "reviews": 25}', '6bb57bc9-6cd2-4a9c-97b5-4df83102f4c8'::uuid, 2),
  ('PixelFlow', 'Design in flow', 'Prototype with real data.', 'Link Figma to live APIs.', 'https://example.com/icons/pixel.png', 'https://pixelflow.demo', '{"views": 80, "reviews": 7}', '6bb57bc9-6cd2-4a9c-97b5-4df83102f4c8'::uuid, 3),
  ('GrowthHack', 'Metrics that matter', 'Track growth and experiments.', 'Integrate and run A/B tests.', 'https://example.com/icons/growth.png', 'https://growthhack.demo', '{"views": 150, "reviews": 18}', '6bb57bc9-6cd2-4a9c-97b5-4df83102f4c8'::uuid, 4),
  ('ModelKit', 'Train and deploy ML', 'No-code ML pipelines.', 'Upload data, get a model.', 'https://example.com/icons/model.png', 'https://modelkit.demo', '{"views": 90, "reviews": 12}', '6bb57bc9-6cd2-4a9c-97b5-4df83102f4c8'::uuid, 5);

-- =============================================================================
-- 5. reviews (product_id, profile_id; rating 1–5)
-- =============================================================================
INSERT INTO reviews (product_id, profile_id, rating)
VALUES
  (1, '6bb57bc9-6cd2-4a9c-97b5-4df83102f4c8'::uuid, 5),
  (2, '6bb57bc9-6cd2-4a9c-97b5-4df83102f4c8'::uuid, 4),
  (3, '6bb57bc9-6cd2-4a9c-97b5-4df83102f4c8'::uuid, 5),
  (4, '6bb57bc9-6cd2-4a9c-97b5-4df83102f4c8'::uuid, 3),
  (5, '6bb57bc9-6cd2-4a9c-97b5-4df83102f4c8'::uuid, 4);

-- =============================================================================
-- 6. gpt_ideas_likes (composite PK: idea_id, profile_id) — 1 row
-- =============================================================================
INSERT INTO gpt_ideas_likes (idea_id, profile_id)
VALUES (1, '6bb57bc9-6cd2-4a9c-97b5-4df83102f4c8'::uuid);

-- =============================================================================
-- 7. product_upvotes (composite PK: product_id, profile_id) — 1 row
-- =============================================================================
INSERT INTO product_upvotes (product_id, profile_id)
VALUES (1, '6bb57bc9-6cd2-4a9c-97b5-4df83102f4c8'::uuid);

-- =============================================================================
-- 8. follows (follower_id, following_id → profiles) — 1 row (self-follow)
-- =============================================================================
INSERT INTO follows (follower_id, following_id)
VALUES ('6bb57bc9-6cd2-4a9c-97b5-4df83102f4c8'::uuid, '6bb57bc9-6cd2-4a9c-97b5-4df83102f4c8'::uuid);

-- =============================================================================
-- 9. community_topics (unique slug)
-- =============================================================================
INSERT INTO community_topics (name, slug)
VALUES
  ('General', 'general'),
  ('Feedback', 'feedback'),
  ('Show and Tell', 'show-and-tell'),
  ('Ideas', 'ideas'),
  ('Jobs', 'jobs');

-- =============================================================================
-- 10. community_posts (topic_id, profile_id)
-- =============================================================================
INSERT INTO community_posts (topic_id, title, content, profile_id)
VALUES
  (1, 'Welcome to the community', 'Introduce yourself and say hi.', '6bb57bc9-6cd2-4a9c-97b5-4df83102f4c8'::uuid),
  (2, 'Feature request: dark mode', 'Would love a dark theme for the dashboard.', '6bb57bc9-6cd2-4a9c-97b5-4df83102f4c8'::uuid),
  (3, 'Launched my first product', 'Shipped last week, here is the link.', '6bb57bc9-6cd2-4a9c-97b5-4df83102f4c8'::uuid),
  (4, 'Idea: API versioning dashboard', 'Tool to track and notify on API changes.', '6bb57bc9-6cd2-4a9c-97b5-4df83102f4c8'::uuid),
  (5, 'Hiring: React dev in NYC', 'Full-time, hybrid. See description.', '6bb57bc9-6cd2-4a9c-97b5-4df83102f4c8'::uuid);

-- =============================================================================
-- 11. community_post_replies (post_id, parent_reply_id, profile_id)
-- =============================================================================
INSERT INTO community_post_replies (post_id, parent_reply_id, reply, profile_id)
VALUES
  (1, NULL, 'Thanks, glad to be here!', '6bb57bc9-6cd2-4a9c-97b5-4df83102f4c8'::uuid),
  (2, NULL, 'Second this, dark mode would be great.', '6bb57bc9-6cd2-4a9c-97b5-4df83102f4c8'::uuid),
  (3, NULL, 'Congrats on the launch.', '6bb57bc9-6cd2-4a9c-97b5-4df83102f4c8'::uuid),
  (4, NULL, 'Interesting idea, would use it.', '6bb57bc9-6cd2-4a9c-97b5-4df83102f4c8'::uuid),
  (5, NULL, 'Applied, looking forward to hearing back.', '6bb57bc9-6cd2-4a9c-97b5-4df83102f4c8'::uuid);

-- =============================================================================
-- 12. community_post_upvotes (composite PK: post_id, profile_id) — 1 row
-- =============================================================================
INSERT INTO community_post_upvotes (post_id, profile_id)
VALUES (1, '6bb57bc9-6cd2-4a9c-97b5-4df83102f4c8'::uuid);

-- =============================================================================
-- 13. teams (team_size 1–100, equity_split 1–100)
-- =============================================================================
INSERT INTO teams (product_name, team_size, equity_split, roles, product_description)
VALUES
  ('SaaS Starter', 2, 50, 'Developer, Designer', 'Template and boilerplate for B2B SaaS.'),
  ('Mobile App Co', 3, 33, 'iOS, Android, Backend', 'Cross-platform fitness app.'),
  ('AI Agency', 5, 20, 'ML, Frontend, Backend, PM, Sales', 'Custom AI solutions for enterprises.'),
  ('Design Studio', 4, 25, '2 Designers, 2 Devs', 'Brand and product design.'),
  ('Indie Hackers', 1, 100, 'Solo founder', 'Bootstrapped micro-SaaS.');

-- =============================================================================
-- 14. message_rooms
-- =============================================================================
INSERT INTO message_rooms DEFAULT VALUES;
INSERT INTO message_rooms DEFAULT VALUES;
INSERT INTO message_rooms DEFAULT VALUES;
INSERT INTO message_rooms DEFAULT VALUES;
INSERT INTO message_rooms DEFAULT VALUES;

-- =============================================================================
-- 15. message_room_members (message_room_id, profile_id)
-- =============================================================================
INSERT INTO message_room_members (message_room_id, profile_id)
VALUES
  (1, '6bb57bc9-6cd2-4a9c-97b5-4df83102f4c8'::uuid),
  (2, '6bb57bc9-6cd2-4a9c-97b5-4df83102f4c8'::uuid),
  (3, '6bb57bc9-6cd2-4a9c-97b5-4df83102f4c8'::uuid),
  (4, '6bb57bc9-6cd2-4a9c-97b5-4df83102f4c8'::uuid),
  (5, '6bb57bc9-6cd2-4a9c-97b5-4df83102f4c8'::uuid);

-- =============================================================================
-- 16. messages (message_room_id, sender_id, content)
-- =============================================================================
INSERT INTO messages (message_room_id, sender_id, content)
VALUES
  (1, '6bb57bc9-6cd2-4a9c-97b5-4df83102f4c8'::uuid, 'Hello, anyone here?'),
  (2, '6bb57bc9-6cd2-4a9c-97b5-4df83102f4c8'::uuid, 'Quick question about the API.'),
  (3, '6bb57bc9-6cd2-4a9c-97b5-4df83102f4c8'::uuid, 'Thanks for the feedback.'),
  (4, '6bb57bc9-6cd2-4a9c-97b5-4df83102f4c8'::uuid, 'Meeting at 3pm?'),
  (5, '6bb57bc9-6cd2-4a9c-97b5-4df83102f4c8'::uuid, 'Ship it.');

-- =============================================================================
-- 17. notifications (source_id, product_id, post_id, target_id, type)
-- type: 'follow' | 'review' | 'reply' | 'mention'
-- =============================================================================
INSERT INTO notifications (source_id, product_id, post_id, target_id, type)
VALUES
  ('6bb57bc9-6cd2-4a9c-97b5-4df83102f4c8'::uuid, NULL, NULL, '6bb57bc9-6cd2-4a9c-97b5-4df83102f4c8'::uuid, 'follow'),
  ('6bb57bc9-6cd2-4a9c-97b5-4df83102f4c8'::uuid, 1, NULL, '6bb57bc9-6cd2-4a9c-97b5-4df83102f4c8'::uuid, 'review'),
  ('6bb57bc9-6cd2-4a9c-97b5-4df83102f4c8'::uuid, NULL, 1, '6bb57bc9-6cd2-4a9c-97b5-4df83102f4c8'::uuid, 'reply'),
  ('6bb57bc9-6cd2-4a9c-97b5-4df83102f4c8'::uuid, NULL, 2, '6bb57bc9-6cd2-4a9c-97b5-4df83102f4c8'::uuid, 'mention'),
  ('6bb57bc9-6cd2-4a9c-97b5-4df83102f4c8'::uuid, 2, NULL, '6bb57bc9-6cd2-4a9c-97b5-4df83102f4c8'::uuid, 'review');
