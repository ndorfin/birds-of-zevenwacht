from django.db import models
from . import Person

def person_id_folder_path(instance, filename): 
  # file will be uploaded to `MEDIA_ROOT/birds/<photographer.id>/<filename>`
  return 'birds/{0}/{1}'.format(instance.photographer.id, filename) 

class Photo(models.Model):
  def __str__(self):
    return self.datetime.strftime('%Y-%m-%d %H:%M:%S')
  
  datetime = models.DateTimeField("Date and time of photo",
    help_text="What date and time was this photo?",
    db_comment="We need a to-the-minute recording of the time and date of this photo",
  )
  photographer = models.ForeignKey(
    Person,
    help_text="Who took this Photo?",
    on_delete=models.CASCADE,
    default=Person.get_default_pk,
  )
  source_photo = models.ImageField(
    "Source photo",
    default="",
    upload_to=person_id_folder_path,
  )
  description = models.CharField(
    "Description",
    max_length=256,
    default="",
    help_text="Describe this photo, as if you were describing it over the phone to someone",
    db_comment="This plain text will act as alternative text for the image",
  )
