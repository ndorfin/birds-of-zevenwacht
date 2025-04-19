from django.contrib import admin
from .models import Sighting, Person, Bird

admin.site.register([
  Sighting,
  Person,
  Bird,
])
