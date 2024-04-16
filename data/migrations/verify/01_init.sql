
CREATE OR REPLACE FUNCTION verify_domain(domain_name text) RETURNS void AS $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_catalog.pg_type 
    WHERE typname = domain_name
  ) THEN 
    RAISE EXCEPTION 'Domain % does not exist', domain_name;
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION verify_table(table_name text) RETURNS void AS $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_catalog.pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = table_name
  ) THEN 
    RAISE EXCEPTION 'Table % does not exist', table_name;
  END IF;
END;
$$ LANGUAGE plpgsql;

SELECT verify_domain('mail_address');
SELECT verify_domain('pcode');
SELECT verify_domain('phone_number');
SELECT verify_domain('siret');
SELECT verify_domain('rating');
SELECT verify_domain('pint');
SELECT verify_domain('pnum');
SELECT verify_domain('url');

SELECT verify_table('category');
SELECT verify_table('member');
SELECT verify_table('member_likes_category');
SELECT verify_table('member_likes_training');
SELECT verify_table('organization');
SELECT verify_table('review');
SELECT verify_table('training');