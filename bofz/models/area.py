from django.db import models

class Area(models.Model):
  def __str__(self):
    return self.name
  
  name = models.CharField("Name",
    max_length=32,
    default="",
    help_text="The name of this gated community, farm, or other",
    db_comment="Helps identify the general area a sighting or photo will be bound by. Useful to obfuscate sightings taken from a Person's home."
  )
  street = models.CharField("Street name and number",
    max_length=32,
    default="",
    help_text="What is the street name and number for the entrance to this Area?",
    db_comment="Used with the suburb to build up a physical address",
  )
  suburb = models.CharField("Suburb",
    max_length=32,
    default="Kuils River",
    help_text="What is the suburb or municipality of this Area",
    db_comment="Used with the street address to build up a physical address",
  )
  entrance = models.JSONField("Entrance (GeoJSON)",
    help_text="The GPS location (in GeoJSON) of the entrance of this Area. Use https://geojson.io/",
  )
  centre = models.JSONField("Centre (GeoJSON)",
    help_text="The GPS location (in GeoJSON) of the centre of this Area. Use https://geojson.io/",
  )
  boundaries = models.JSONField("Boundary (GeoJSON) or GeoFence",
    help_text="Supply the GeoJSON of coordinates that creates the outer boundary of the Area. Use https://geojson.io/",
  )
