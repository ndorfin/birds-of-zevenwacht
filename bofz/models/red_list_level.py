from django.db import models

class RedListLevel(models.Model):
  def __str__(self):
    return self.label + ' (' + self.abbreviation + ')'
  
  class Meta:
    ordering = ["severity"]
  
  @classmethod
  def get_default_pk(cls):
    level, created = cls.objects.get_or_create(
      abbreviation="LC",
      label="Least Concern",
      severity=5,
    )
    return level.pk
  
  severity = models.PositiveIntegerField("Severity rank",
    help_text="Where 1 = CR/Critically endangered and 5 = LC/Least Concern",
    db_comment="How severe is this level?"
  )
  abbreviation = models.CharField("Abbreviation",
    max_length=2,
    help_text="2 characters or less",
    db_comment="The abbreviated form of this RedList level"
  )
  label = models.CharField("Label",
    max_length=32,
    help_text="The human readable name for this RedList level",
    db_comment="The longer form of the abbreviation"
  )
