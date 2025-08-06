from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models

class PersonManager(BaseUserManager):
  def create_user(self, email, password=None, **extra_fields):
    if not email:
      raise ValueError('The Email field must be set')
    email = self.normalize_email(email)
    user = self.model(email=email, **extra_fields)
    user.set_password(password)
    user.save(using=self._db)
    return user

  def create_superuser(self, email, password=None, **extra_fields):
    extra_fields.setdefault('is_staff', True)
    extra_fields.setdefault('is_superuser', True)
    return self.create_user(email, password, **extra_fields)

class Person(AbstractBaseUser, PermissionsMixin):
  email = models.EmailField(
    unique=True,
  )
  # Add any other desired fields
  short_name = models.CharField(
    max_length=16,
  )
  full_name = models.CharField(
    max_length=64,
    null=True,
  )
  is_active = models.BooleanField(
    default=True
  )
  is_staff = models.BooleanField(
    default=False
  )

  USERNAME_FIELD = 'email'
  REQUIRED_FIELDS = ['short_name'] # No other fields are required for superuser creation

  objects = PersonManager()

  def __str__(self):
    return self.short_name
