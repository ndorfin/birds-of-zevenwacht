from django.db import models

class Person(models.Model):
  def __str__(self):
    return self.full_name + ' <' + self.email + '>'
  
  @classmethod
  def get_default_pk(cls):
    person, created = cls.objects.get_or_create(
      full_name="Shaun O'Connell",
      short_name="Shaun",
      email="shaun@tactile.co.za",
    )
    return person.pk

  full_name = models.CharField("Full name",
    max_length=32,
    help_text="Their full name",
    db_comment="Avoids problems with first, last, family, and surnames",
  )
  short_name = models.CharField("Short name",
    max_length=16,
    help_text="What should we call them?",
  )
  email = models.EmailField("Email address",
    max_length=64,
    help_text="Used as their username, and our way of staying in contact",
  )
