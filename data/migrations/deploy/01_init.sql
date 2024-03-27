-- SQLBook: Code
-- Deploy otalent:01_init to pg

BEGIN;

CREATE DOMAIN mail_address AS TEXT CHECK (
  VALUE ~ '^[a-zA-Z0-9.!#$%&''*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$'
  );

CREATE DOMAIN pcode AS text CHECK (
    VALUE ~ '^0[1-9]\d{3}|[1-8]\d{4}|9[0-6]\d{3}|9[78][12478]\d{2}$'
);
CREATE DOMAIN phone_number AS TEXT CHECK (
  VALUE ~ '^0[1-9](\d{2}){4}$'
);
CREATE DOMAIN siret AS TEXT CHECK (
  VALUE ~ '^\d{14}$'
);
CREATE DOMAIN rating AS INT CHECK (VALUE >= 0 AND VALUE <= 5);

CREATE DOMAIN pint AS INT CHECK (VALUE > 0);
CREATE DOMAIN pnum AS numeric CHECK (VALUE > 0.0);
CREATE DOMAIN url AS TEXT CHECK (VALUE ~ '^(https?):\/\/[^\s\/$.?#].[^\s]*$');

CREATE TABLE category
(
  id    INT  NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  label TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ
);



CREATE TABLE member
(
  id          INT         NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY ,
  firstname   TEXT        NOT NULL,
  lastname    TEXT        NOT NULL,
  email       mail_address NOT NULL UNIQUE,
  password    TEXT        NOT NULL,
  city        TEXT,
  postal_code pcode,
  avatar      url,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ
);

CREATE TABLE member_likes_category
(
  id          INT NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  member_id   INT NOT NULL,
  category_id INT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ,
  UNIQUE(member_id, category_id)
);

CREATE TABLE member_likes_training
(
  id          INT NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  member_id   INT NOT NULL,
  training_id INT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ,
  UNIQUE(member_id, training_id)
);

CREATE TABLE organization
(
  id           INT          NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name         TEXT         NOT NULL,
  email        mail_address NOT NULL UNIQUE,
  password     TEXT         NOT NULL,
  phone_number phone_number NOT NULL,
  address      TEXT         NOT NULL,
  city         TEXT         NOT NULL,
  postal_code  pcode        NOT NULL,
  siret        siret        NOT NULL,
  description  TEXT,
  image        url,
  url_site     url,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ
);

CREATE TABLE review
(
  id          INT     NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  rating      rating  NOT NULL,
  comment     TEXT,
  training_id INT     NOT NULL,
  member_id   INT     NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ
);

CREATE TABLE training
(
  id              INT     NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  label           TEXT    NOT NULL,
  description     TEXT    NOT NULL,
  price           pnum    NOT NULL DEFAULT 0.0,
  duration        pint    NOT NULL,
  dates           DATE[]  NOT NULL CHECK (cardinality(dates) > 0),
  excerpt         TEXT    NOT NULL,
  prerequisites   TEXT   ,
  program         TEXT   ,
  image           url   ,
  organization_id INT     NOT NULL,
  category_id     INT     NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ
);

ALTER TABLE member_likes_category
  ADD CONSTRAINT FK_category_TO_member_likes_category
    FOREIGN KEY (member_id)
    REFERENCES member (id)
    ON DELETE CASCADE;

ALTER TABLE member_likes_category
  ADD CONSTRAINT FK_member_TO_member_likes_category
    FOREIGN KEY (category_id)
    REFERENCES category (id)
    ON DELETE CASCADE;

ALTER TABLE member_likes_training
  ADD CONSTRAINT FK_training_TO_member_likes_training
    FOREIGN KEY (training_id)
    REFERENCES training (id)
    ON DELETE CASCADE;

ALTER TABLE member_likes_training
  ADD CONSTRAINT FK_member_TO_member_likes_training
    FOREIGN KEY (member_id)
    REFERENCES member (id)
    ON DELETE CASCADE;

ALTER TABLE training
  ADD CONSTRAINT FK_organization_TO_training
    FOREIGN KEY (organization_id)
    REFERENCES organization (id)
    ON DELETE CASCADE;

ALTER TABLE review
  ADD CONSTRAINT FK_training_TO_review
    FOREIGN KEY (training_id)
    REFERENCES training (id)
    ON DELETE CASCADE;

ALTER TABLE review
  ADD CONSTRAINT FK_member_TO_review
    FOREIGN KEY (member_id)
    REFERENCES member (id)
    ON DELETE CASCADE;

ALTER TABLE training
  ADD CONSTRAINT FK_category_TO_training
    FOREIGN KEY (category_id)
    REFERENCES category (id)
    ON DELETE CASCADE;

CREATE INDEX member_email_idx ON member USING HASH(email);
CREATE INDEX organization_email_idx ON organization USING HASH(email);        

--CRUD functions
CREATE FUNCTION insert_member(json) RETURNS member AS $$
  INSERT INTO member (firstname, lastname, password, email, postal_code, city, avatar)
  VALUES (
    $1->>'firstname',
    $1->>'lastname',
    $1->>'password',
    $1->>'email',
    $1->>'postalCode',
    $1->>'city',
    $1->>'urlAvatar'
  ) RETURNING *;
$$ LANGUAGE SQL STRICT;

CREATE FUNCTION insert_organization(json) RETURNS organization AS $$
  INSERT INTO organization (name, email, password, phone_number, url_site, address, description, city, postal_code, siret, image)
  VALUES (
    $1->>'name',
    $1->>'email',
    $1->>'password',
    $1->>'phoneNumber',
    $1->>'urlSite',
    $1->>'address',
    $1->>'description',
    $1->>'city',
    $1->>'postalCode',
    $1->>'siret',
    $1->>'image'
  ) RETURNING *;
$$ LANGUAGE SQL STRICT;

CREATE FUNCTION insert_review(json) RETURNS review AS $$
  INSERT INTO review (rating, comment, training_id, member_id)
  VALUES (
    ($1->>'rating')::rating,
    $1->>'comment',
    ($1->>'trainingId')::INT,
    ($1->>'memberId')::INT
  ) RETURNING *
$$ LANGUAGE SQL STRICT;

CREATE FUNCTION insert_training(json) RETURNS training AS $$
  INSERT INTO training (label, description, price, duration, dates, excerpt, prerequisites, program, image, organization_id, category_id)
  VALUES (
    $1->>'label',
    $1->>'description',
    ($1->>'price')::pnum,
    ($1->>'duration')::pint,
    CASE
      WHEN ($1->>'startingDate') IS NOT NULL AND ($1->>'endingDate') IS NOT NULL THEN
        ARRAY[($1->>'startingDate')::DATE, ($1->>'endingDate')::DATE]::DATE[]
      ELSE
        NULL
    END,
    $1->>'excerpt', 
    $1->>'prerequisites',
    $1->>'program',
    $1->>'image',
    ($1->>'organizationId')::INT,
    ($1->>'categoryId')::INT
  ) RETURNING *
$$ LANGUAGE SQL STRICT;

CREATE FUNCTION insert_category(json) RETURNS category AS $$
  INSERT INTO category (label)
  VALUES (
    $1->>'label'
  ) RETURNING *
$$ LANGUAGE SQL STRICT;
COMMIT;
