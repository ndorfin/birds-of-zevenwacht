from django.db import models
from .red_list_level import RedListLevel

class Bird(models.Model):
  def __str__(self):
    return self.common_name
  
  @classmethod
  def get_default_pk(cls):
    bird, created = cls.objects.get_or_create(
      genus="Anthropoides",
      species="paradiseus",
      defaults=dict(
        family="Crane",
        common_name="Blue Crane",
      ),
    )
    return bird.pk
  
  genus = models.CharField("Genus",
    max_length=64,
    default="",
    help_text="The scientific name of their genus, e.g. 'Anthropoides'"
  )
  species = models.CharField("Species",
    max_length=64,
    default="",
    help_text="The scientific name of their species, usually lowercase. e.g. 'paradiseus'"
  )
  family = models.CharField("Family name",
    max_length=32,
    default="",
    help_text="Common name of this species' family or grouping, e.g. 'Crane'"
  )
  common_name = models.CharField("Common name",
    max_length=64,
    default="",
    help_text="e.g. Blue Crane",
    db_comment="English common name for this species. e.g. 'Blue Crane'"
  )
  afrikaans_name = models.CharField("Afrikaans name",
    max_length=64,
    default="",
    blank=True,
    help_text="e.g. Blou Kraanvoël",
    db_comment="Afrikaans common name for this species, e.g. 'Blou Kraanvoël'"
  )
  german_name = models.CharField("German name",
    max_length=64,
    default="",
    blank=True,
    help_text="e.g. Paradieskranich",
    db_comment="German common name for this species, e.g. 'Paradieskranich'"
  )
  ebird = models.URLField("eBird URL",
    max_length=64,
    default="",
    blank=True,
    help_text="e.g. https://ebird.org/species/blucra2/ZA",
    db_comment="Useful as a reference for this bird"
  )
  wikipedia = models.URLField("Wikipedia URL",
    max_length=64,
    default="",
    blank=True,
    help_text="e.g. https://en.wikipedia.org/wiki/Blue_crane",
    db_comment="Useful as a reference for this bird"
  )
  redlist_level = models.ForeignKey(
    RedListLevel,
    on_delete=models.CASCADE,
    default=RedListLevel.get_default_pk,
  )
