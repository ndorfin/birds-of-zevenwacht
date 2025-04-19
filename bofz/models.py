from django.db import models

class Sighting(models.Model):
  datetime = models.DateTimeField("Date and time of sighting")
