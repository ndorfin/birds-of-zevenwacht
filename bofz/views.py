from django.shortcuts import render
from django.views import View
from django.views.generic import DetailView, ListView
from .models import Bird, Photo, Sighting, Person

# ===============================
# Setup
# ===============================

class GenericView(View):
  layout = 'layouts/default.jinja'
  page_id = None
  page_name = None
  page_description = None
  
  def get_context(self, additional_context = {}):
    context = {
      'page_id': self.page_name.lower().replace(' ', '_'),
      'page_name': self.page_name,
      'page_description': self.page_description,
      'layout': self.layout,
      **additional_context,
    }
    return context

class GenericListView(ListView):
  def get_context_data(self, **kwargs):
    # Call the base implementation first to get a context
    context = super().get_context_data(**kwargs)
    # Add extra context data
    context["layout"] = 'layouts/default.jinja'
    return context

class GenericDetailView(DetailView):
  def get_context_data(self, **kwargs):
    # Call the base implementation first to get a context
    context = super().get_context_data(**kwargs)
    # Add extra context data
    context["layout"] = 'layouts/default.jinja'
    return context


# ===============================
# Views
# ===============================

# Static pages
# ------------------
class ViewHome(GenericView):
  def __init__(self):
    self.page_name = 'Home'
    self.page_description = 'A community birding project'
    
  def get(self, request):
    return render(request, 'index.jinja', self.get_context())

class ViewAbout(GenericView):
  def __init__(self):
    self.page_name = 'About'
    self.page_description = 'More information about this community project'
    
  def get(self, request):
    return render(request, 'about.jinja', self.get_context())

class ViewAttribution(GenericView):
  def __init__(self):
    self.page_name = 'Attribution'
    self.page_description = 'This community project wouldn’t be possible without its contributors, owners, and Open Source Software (OSS)'

  def get(self, request):
    return render(request, 'attribution.jinja', self.get_context())

# Birds
# ------------------
class BirdListView(GenericListView):
  model = Bird
  context_object_name = "birds"
  template_name = "birds/list.jinja"
  
class BirdDetailView(GenericDetailView):
  model = Bird
  context_object_name = "bird"
  template_name = "birds/detail.jinja"

# Photos
# ------------------
class PhotoListView(GenericListView):
  model = Photo
  context_object_name = "photos"
  template_name = "photos/list.jinja"
  
class PhotoDetailView(GenericDetailView):
  model = Photo
  context_object_name = "photo"
  template_name = "photos/detail.jinja"

# Sightings
# ------------------
class SightingListView(GenericListView):
  model = Sighting
  context_object_name = "sightings"
  template_name = "sightings/list.jinja"
  
class SightingDetailView(GenericDetailView):
  model = Sighting
  context_object_name = "sighting"
  template_name = "sightings/detail.jinja"

# Persons
# ------------------
class PersonListView(GenericListView):
  model = Person
  context_object_name = "persons"
  template_name = "persons/list.jinja"
  
class PersonDetailView(GenericDetailView):
  model = Person
  context_object_name = "person"
  template_name = "persons/detail.jinja"
