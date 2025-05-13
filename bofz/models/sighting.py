from django.db import models
from django.contrib.auth.models import User
from django.urls import reverse
from . import Area, Bird, Photo

class Sighting(models.Model):

  class Meta:
    ordering = ['-datetime']

  def __str__(self):
    return self.datetime.strftime('%Y-%m-%d %H:%M:%S')
  
  def get_absolute_url(self):
    return reverse('sighting_detail', args=[str(self.id)])
  
  @classmethod
  def get_default_pk(cls):
    sighting, created = cls.objects.get(pk=cls.pk)
    return sighting.pk

  datetime = models.DateTimeField("Date and time of sighting",
    help_text="What date and time was this sighting?",
    db_comment="We need a to-the-minute recording of the time and date of this sighting. We can potentially infer this from any supporting photos' EXIF data.",
  )
  observers = models.ManyToManyField(
    User,
    help_text="Who observed these birds?",
  )
  bird = models.ForeignKey(
    Bird,
    help_text="Select the species you observed in this Sighting",
    on_delete=models.CASCADE,
    default='',
  )
  quantity = models.PositiveIntegerField("Quantity",
    default=1,
    help_text="How many total individuals of this species were seen?",
    db_comment="We need numbers of the species",
  )
  photos = models.ManyToManyField(
    Photo,
    help_text="Select the optional Photos associated with this Sighting",
    blank=True,
  )
  area = models.ForeignKey(
    Area,
    help_text="Which Area was this Sighting recorded in?",
    on_delete=models.CASCADE,
    default=Area.get_default_pk,
  )
