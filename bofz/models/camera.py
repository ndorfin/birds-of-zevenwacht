from django.db import models

class Camera(models.Model):
  def __str__(self):
    return self.manufacturer + ' ' + self.model_name
  
  exif_identifier = models.CharField("EXIF identifier",
    max_length=32,
    default="",
    help_text="The combination of manufacturer and model used in the Photo's EXIF data to identify this Camera, e.g. Canon-Canon EOS 500D",
  )
  manufacturer = models.CharField("Manufacturer",
    max_length=32,
    default="",
    help_text="The name of the Camera's brand or manufacturer, e.g. Apple",
  )
  model_name = models.CharField("Model",
    max_length=32,
    default="",
    help_text="The name of the Camera's model, e.g. EOS 5D Mark II",
  )
