from django.shortcuts import render
from django.contrib.auth.mixins import PermissionRequiredMixin
from django.views import View
from django.views.generic import DetailView, ListView
from .models import Area, RedListLevel, Bird, Photo, Sighting, Person, SpeciesList

# ===============================
# Setup
# ===============================
DEFAULT_LAYOUT = 'layouts/default.jinja'
class GenericView(View):
  template_name = ''
  
  def get_context(self, additional_context = {}):
    context = {
      'layout': DEFAULT_LAYOUT,
      **additional_context,
    }
    return context
  
  def simple_get(self, request):
    return render(request, self.template_name, self.get_context())

class GenericListView(ListView):
  def get_context_data(self, **kwargs):
    # Call the base implementation first to get a context
    context = super().get_context_data(**kwargs)
    # Add extra context data
    context["layout"] = DEFAULT_LAYOUT
    return context

class GenericDetailView(DetailView):
  def get_context_data(self, **kwargs):
    # Call the base implementation first to get a context
    context = super().get_context_data(**kwargs)
    # Add extra context data
    context["layout"] = DEFAULT_LAYOUT
    return context


# ===============================
# Views
# ===============================

# Static pages
# ------------------
class ViewHome(GenericView):
  template_name = 'index.jinja'

  def get(self, request):
    return self.simple_get(request)

class ViewAbout(GenericView):
  template_name = 'about.jinja'

  def get(self, request):
    return self.simple_get(request)

class ViewAttribution(GenericView):
  template_name = 'attribution.jinja'

  def get(self, request):
    return self.simple_get(request)

class ViewStartLogOut(GenericView):
  template_name = 'auth/log-out.jinja'

  def get(self, request):
    return self.simple_get(request)

# Areas
# ------------------
class AreaListView(GenericListView):
  model = Area
  context_object_name = "areas"
  template_name = "areas/list.jinja"
  
class AreaDetailView(GenericDetailView):
  model = Area
  context_object_name = "area"
  template_name = "areas/detail.jinja"

# Birds
# ------------------
class BirdListView(GenericListView):
  model = Bird
  ordering = ['family', 'common_name']
  context_object_name = "birds"
  template_name = "birds/list.jinja"
  
class BirdDetailView(GenericDetailView):
  model = Bird
  context_object_name = "bird"
  template_name = "birds/detail.jinja"
  
  def get_context_data(self, **kwargs):
    context = super().get_context_data(**kwargs)
    # Add the SpeciesLists this Bird is a member of
    context['memberships'] = SpeciesList.objects.filter(birds__id=self.object.id)
    context['redlist_levels'] = RedListLevel.objects.all()
    return context

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


class SightingAddView(PermissionRequiredMixin, GenericView):
  permission_required = "bofz.can_add_sighting"
  template_name = "sightings/add.jinja"
  login_url = "log-in"

  def get(self, request):
    return self.simple_get(request)

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

# SpeciesList
# ------------------
class SpeciesListListView(GenericListView):
  model = SpeciesList
  context_object_name = "species_lists"
  template_name = "species-lists/list.jinja"
  
class SpeciesListDetailView(GenericDetailView):
  model = SpeciesList
  context_object_name = "species_list"
  template_name = "species-lists/detail.jinja"
