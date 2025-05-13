from django.db import models

class Area(models.Model):

  class Meta:
    ordering = ['name']

  def __str__(self):
    return self.name
  
  @classmethod
  def get_default_pk(cls):
    area, created = cls.objects.get_or_create(
      name="Zevenwacht Wine Estate",
      url="https://zevenwacht.co.za/",
      street="Langverwacht Road",
      suburb="Kuils River",
      entrance="""{"type": "FeatureCollection","features": [{"type": "Feature","properties": {},"geometry": {"coordinates": [18.716808,-33.931888],"type": "Point"}}]}""",
      centre="""{"type": "FeatureCollection","features": [{"type": "Feature","properties": {},"geometry": {"coordinates": [18.72688484297163,-33.923262090489935],"type": "Point"}}]}""",
      boundaries="""{"type": "FeatureCollection","features": [{"type": "Feature","properties": {},"geometry": {"coordinates": [[[18.7141857,-33.9309527],[18.7144212,-33.9308127],[18.717304,-33.9320831],[18.7174435,-33.932684],[18.7207401,-33.9322052],[18.7222636,-33.9324722],[18.7250531,-33.9321874],[18.7259023,-33.9315725],[18.7314169,-33.9333885],[18.7364809,-33.9350798],[18.7419818,-33.9362545],[18.7423465,-33.9350834],[18.7431834,-33.9341359],[18.743913,-33.9324268],[18.7396964,-33.9326994],[18.7334545,-33.9297288],[18.7333277,-33.9220466],[18.7328871,-33.917565],[18.7269434,-33.9158734],[18.7237554,-33.9169632],[18.7226396,-33.9170522],[18.7216955,-33.9175864],[18.7139467,-33.9106511],[18.7102106,-33.9205235],[18.7129427,-33.9214022],[18.7131359,-33.9228381],[18.7131009,-33.9254008],[18.7136009,-33.9300981],[18.713778,-33.9305521],[18.7141857,-33.9309527]]],"type": "Polygon"}}]}""",
    )
    return area.pk
  
  name = models.CharField("Name",
    max_length=32,
    default="",
    help_text="The name of this gated community, farm, or other",
    db_comment="Helps identify the general area a sighting or photo will be bound by. Areas are useful to obfuscate sightings taken from a Person's home.",
  )
  url = models.URLField("Website",
    max_length=64,
    null=True,
    help_text="Does this Area have a representative website?",
    db_comment="Provides a reference link to the Area",
  )
  street = models.CharField("Street name and number",
    max_length=32,
    default="",
    null=True,
    help_text="What is the street name and number for the entrance to this Area?",
    db_comment="Used with the suburb to build up a physical address",
  )
  suburb = models.CharField("Suburb",
    max_length=32,
    default="Kuils River",
    null=True,
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
