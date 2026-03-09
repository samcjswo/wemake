create view community_post_list_view as
select
    community_posts.post_id,
    community_posts.title,
    community_posts."createdAt",
    community_topics.name as topic_name,
    profiles.name as author_name,
    profiles.username as author_username,
    profiles.avatar as author_avatar,
    count(community_post_upvotes.post_id) as upvote_count
from community_posts
left join community_topics on community_posts.topic_id = community_topics.topic_id
left join profiles on community_posts.profile_id = profiles.profile_id
left join community_post_upvotes on community_posts.post_id = community_post_upvotes.post_id
group by community_posts.post_id, community_topics.name, profiles.name, profiles.username, profiles.avatar