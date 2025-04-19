from django.db import models

class Sighting(models.Model):
  date = models.DateTimeField("Date and time of sighting")
