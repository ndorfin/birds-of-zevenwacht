# Birds of Zevenwacht

A collection of photos and sightings of various birds near Zevenwacht Wine Esate, Cape Town, South Africa

You can find this site online at [ndorfin.github.io/birds-of-zevenwacht](https://ndorfin.github.io/birds-of-zevenwacht/)

## Developers

### Introduction

#### Technology

This repo uses:

- Node.js
- [Eleventy](https://11ty.dev).
- a smattering of Web Platform tech

#### Data

The main data types are:

- **`Bird`** - A known species
- **`Sighting`** - A recorded observation of a `Bird` by a `Person` in a known `Area`, optionally at a specific coordinate
- **`Photo`** - A recorded capture of a `Bird` by a `Person` in a known `Area`, optionally at a specific coordinate
- **`Person`** - A known contributor to the project
- **`Area`** - A known bounded area on the map, typically a farm, or a housing estate.

We also use some metadata:

- **`Camera`** - The make and model of a camera used by a `Person`
- **`EXIF`** - The metadata for a `Photo`: Lens information, parameters, datetime, location, etc.
- **`SpeciesList`** - A contributing list of `Bird` species by a `Person`, or `Organisation`.
- **`RedList`** - A predefined set of status levels of a `Bird`'s endangerment.

The source data can be found in `src/_data`.

##### JSON Schemas for the YAML data entries

This repo makes extensive use of YAML files for data entry.

If you'd like VSCode validation and descriptions of each of the different types of entries, then install the YAML Extension by Red Hat. VSCode then uses the JSON Scheams in the provided `/schemas` folder.

Also see `/.vscode/settings.json`.


### Dependencies

I'd recommend using ASDF or NVM to manage your Node runtime. You'll need:

- Node v20.15.1+

### Installation

Clone this repo into a project directory on your machine

```bash
git clone [URL_FOR_THIS_REPO]
```

Make sure Node is at the correct version or higher:

```bash
node -v
#$ v20.15.1
```

Install dependencies

```bash
npm i
```

### Starting the development environment

```bash
npm start
```

### Production builds

Every time a commit is merged or pushed to `main`, GitHub Actions does a build using the `npm run build:prod` task. See `.github/workflows/eleventy_build.yml`

The Actions workflow then pushes the output of the `dist` folder to GitHub Pages.