from django.templatetags.static import static
from django.urls import reverse, reverse_lazy
from jinja2 import Environment
from django.conf import settings

def environment(**options):
  env = Environment(**options)
  env.globals.update(
    {
      "static": static,
      "url": reverse,
      "reverse_lazy": reverse_lazy,
      "debug": settings.DEBUG,
    }
  )
  return env
