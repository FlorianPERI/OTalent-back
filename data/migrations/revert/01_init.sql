-- SQLBook: Code
-- Revert otalent:01_init from pg

BEGIN;

DROP TABLE IF EXISTS category, member, member_likes_category, member_likes_training, organization, review, training CASCADE;
DROP DOMAIN IF EXISTS mail_address, pcode, phone_number, siret, rating, pint, pnum, url;

DROP INDEX IF EXISTS member_email_idx, organization_email_idx;
COMMIT;
