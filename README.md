# Birds of Zevenwacht
A collection of photos and sightings of various birds near Zevenwacht Wine Esate, Cape Town, South Africa

## Setup

### Get Environment settings

You'll need to create an `.env` file in the application root for the environment you want to run.

If you want to run a development environment:

```bash
cp .env.dev.sample .env
```

or a production environment:

```bash
cp .env.prod.sample .env
```

Then make the necessary edits to the `.env` file.

**WARNING:** This `.env` file has been deliberately added to `.gitignore`. Never add this `.env` file to source control.

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

**NOTE:** Make sure to run all the fixtures in [`./bofz/fixtures`](./bofz/fixtures).
