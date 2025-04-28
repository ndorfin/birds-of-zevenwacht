from django.contrib import admin
from .models import (
  RedListLevel,
  Person,
  Bird,
  Photo,
  Sighting,
  SpeciesList,
)

admin.site.register([
  RedListLevel,
  Person,
  Bird,
  Photo,
  Sighting,
  SpeciesList,
])
