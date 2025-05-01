from django.contrib import admin
from .models import (
  Area,
  RedListLevel,
  Person,
  Bird,
  Photo,
  Sighting,
  SpeciesList,
)

admin.site.register([
  Area,
  RedListLevel,
  Person,
  Bird,
  Photo,
  Sighting,
  SpeciesList,
])
