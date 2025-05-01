from django.db import models
from .bird import Bird

class SpeciesList(models.Model):
  def __str__(self):
    return self.name
  
  @classmethod
  def get_default_pk(cls):
    species_list, created = cls.objects.get_or_create(
      name="Rolf's Species Count",
    )
    return species_list.pk
  
  name = models.CharField("Name",
    max_length=32,
    default="",
    help_text="What is this list's name, or who supplied this list?",
  )
  url = models.URLField("URL or reference site",
    max_length=64,
    null=True,
    help_text="The canonical reference of this list on the Web",
    db_comment="Any reference we can provide for this source is valuable",
  )
  author = models.CharField("Author or Organisation",
    max_length=32,
    default="",
    help_text="Which individual or group/organisation created this list?",
    db_comment="Identify the responsible authors of this list",
  )
  birds = models.ManyToManyField(
    Bird,
    help_text="All the birds contained in this list",
  )
