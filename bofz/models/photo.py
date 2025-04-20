from django.db import models
from . import Person

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
