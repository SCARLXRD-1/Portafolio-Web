ALTER TABLE profile_settings RENAME COLUMN cv_url TO cv_url_es;
ALTER TABLE profile_settings ADD COLUMN cv_url_en TEXT DEFAULT '';
