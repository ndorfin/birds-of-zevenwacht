from django.db import models

class Sighting(models.Model):
  def __str__(self):
    return self.datetime.strftime('%Y-%m-%d %H:%M:%S')

  datetime = models.DateTimeField("Date and time of sighting",
    help_text="We need a to-the-minute recording of the sighting. We can potentially infer this from any supporting photos' EXIF data."
  )

class Person(models.Model):
  def __str__(self):
    return self.full_name

  full_name = models.CharField("Full name",
    max_length=32,
    help_text="Their full name, avoids problems with first, last, family, and surnames"
  )
  short_name = models.CharField("Short name",
    max_length=16,
    help_text="What should we call them?"
  )
  email = models.EmailField("Email address",
    max_length=64,
    help_text="Used as their username, and our way of staying in contact"
  )

class RedListLevel(models.Model):
  def __str__(self):
    return self.label + ' (' + self.abbreviation + ')'
  
  severity = models.PositiveIntegerField("Severity rank",
    help_text="Where 1 = CR/Critically endangered and 6 = LC/Least Concern",
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

class Bird(models.Model):
  def __str__(self):
    return self.common_name
  
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
    null=True,
    help_text="e.g. Blou Kraanvoël",
    db_comment="Afrikaans common name for this species, e.g. 'Blou Kraanvoël'"
  )
  german_name = models.CharField("German name",
    max_length=64,
    null=True,
    help_text="e.g. Paradieskranich",
    db_comment="German common name for this species, e.g. 'Paradieskranich'"
  )
  ebird = models.URLField("eBird URL",
    max_length=64,
    null=True,
    help_text="e.g. https://ebird.org/species/blucra2/ZA",
    db_comment="Useful as a reference for this bird"
  )
  wikipedia = models.URLField("Wikipedia URL",
    max_length=64,
    null=True,
    help_text="e.g. https://en.wikipedia.org/wiki/Blue_crane",
    db_comment="Useful as a reference for this bird"
  )
