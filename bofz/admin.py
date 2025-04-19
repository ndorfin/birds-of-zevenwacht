from django.contrib import admin
from .models import Bird, Person, RedListLevel, Sighting

admin.site.register([
  Bird,
  Person,
  RedListLevel,
  Sighting,
])
