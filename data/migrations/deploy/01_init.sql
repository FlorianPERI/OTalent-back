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
  label TEXT NOT NULL UNIQUE
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
  avatar      url
);

CREATE TABLE member_likes_category
(
  id          INT NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  member_id   INT NOT NULL,
  category_id INT NOT NULL
);

CREATE TABLE member_likes_training
(
  id          INT NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  member_id   INT NOT NULL,
  training_id INT NOT NULL
);

CREATE TABLE organization
(
  id           INT          NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name         TEXT         NOT NULL,
  email        mail_address NOT NULL,
  password     TEXT         NOT NULL,
  phone_number phone_number NOT NULL,
  address      TEXT         NOT NULL,
  city         TEXT         NOT NULL,
  postal_code  pcode        NOT NULL,
  siret        siret        NOT NULL,
  image        url,
  url_site     url
);

CREATE TABLE review
(
  id          INT     NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  rating      rating  NOT NULL,
  comment     TEXT,
  training_id INT     NOT NULL,
  member_id   INT     NOT NULL
);

CREATE TABLE training
(
  id              INT     NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  label           TEXT    NOT NULL,
  description     TEXT    NOT NULL,
  price           pnum    NOT NULL DEFAULT 0.0,
  duration        pint    NOT NULL,
  dates           DATE[]  NOT NULL,
  excerpt         TEXT    NOT NULL,
  prerequisites   TEXT   ,
  program         TEXT   ,
  image           url   ,
  organization_id INT     NOT NULL,
  category_id     INT     NOT NULL
);

ALTER TABLE member_likes_category
  ADD CONSTRAINT FK_category_TO_member_likes_category
    FOREIGN KEY (member_id)
    REFERENCES category (id);

ALTER TABLE member_likes_category
  ADD CONSTRAINT FK_member_TO_member_likes_category
    FOREIGN KEY (category_id)
    REFERENCES member (id);

ALTER TABLE member_likes_training
  ADD CONSTRAINT FK_training_TO_member_likes_training
    FOREIGN KEY (training_id)
    REFERENCES training (id);

ALTER TABLE member_likes_training
  ADD CONSTRAINT FK_member_TO_member_likes_training
    FOREIGN KEY (member_id)
    REFERENCES member (id);

ALTER TABLE training
  ADD CONSTRAINT FK_organization_TO_training
    FOREIGN KEY (organization_id)
    REFERENCES organization (id);

ALTER TABLE review
  ADD CONSTRAINT FK_training_TO_review
    FOREIGN KEY (training_id)
    REFERENCES training (id);

ALTER TABLE review
  ADD CONSTRAINT FK_member_TO_review
    FOREIGN KEY (member_id)
    REFERENCES member (id);

ALTER TABLE training
  ADD CONSTRAINT FK_category_TO_training
    FOREIGN KEY (category_id)
    REFERENCES category (id);

CREATE INDEX member_email_idx ON member USING HASH(email);
CREATE INDEX organization_email_idx ON organization USING HASH(email);        

COMMIT;
