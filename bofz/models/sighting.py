from django.db import models
from . import Bird, Person

class Sighting(models.Model):
  def __str__(self):
    return self.datetime.strftime('%Y-%m-%d %H:%M:%S')

  datetime = models.DateTimeField("Date and time of sighting",
    help_text="What date and time was this sighting?",
    db_comment="We need a to-the-minute recording of the time and date of this sighting. We can potentially infer this from any supporting photos' EXIF data.",
  )
  observers = models.ManyToManyField(
    Person,
    help_text="Who observed these birds?",
  )
  bird = models.ForeignKey(
    Bird,
    help_text="Select the species you observed in this Sighting",
    on_delete=models.CASCADE,
    default=Bird.get_default_pk,
  )
  quantity = models.PositiveIntegerField("Quantity",
    default=1,
    help_text="How many total individuals of this species were seen?",
  )
