-- SQLBook: Code
-- Verify otalent:01_init on pg

BEGIN;

SELECT * FROM category, member, member_likes_category, member_likes_training, organization, review, training;

ROLLBACK;
