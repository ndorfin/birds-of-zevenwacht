# Birds of Zevenwacht
A collection of photos and sightings of various birds near Zevenwacht Wine Esate, Cape Town, South Africa

## Setup

### Install dependencies

```bash
pip install -r requirements.txt
```

### Run migrations

```bash
python manage.py migrate
```

### Load reference/sample data

```bash
python manage.py loaddata ./bofz/fixtures/01_redlist_levels.yaml
python manage.py loaddata ./bofz/fixtures/02_persons.yaml
…etc…
```
