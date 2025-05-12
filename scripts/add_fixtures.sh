#! bin/sh
# Make sure initial migrations have been made
python manage.py loaddata ./bofz/fixtures/01_redlist_levels.yaml
python manage.py loaddata ./bofz/fixtures/02_persons.yaml
python manage.py loaddata ./bofz/fixtures/03_birds.yaml
python manage.py loaddata ./bofz/fixtures/04_species_lists_01_SABAP2.yaml
python manage.py loaddata ./bofz/fixtures/04_species_lists_02_Louis_lifestyle_list.yaml
python manage.py loaddata ./bofz/fixtures/05_areas.yaml
python manage.py loaddata ./bofz/fixtures/06_cameras.yaml
