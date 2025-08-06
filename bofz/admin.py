from django.contrib import admin
from .models import (
  Area,
  Camera,
  RedListLevel,
  Bird,
  Photo,
  Sighting,
  SpeciesList,
  Person,
)

admin.site.register([
  Area,
  Camera,
  RedListLevel,
  Bird,
  Photo,
  Sighting,
  SpeciesList,
  Person,
])
