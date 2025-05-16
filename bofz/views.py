import os
from django.http import HttpResponseRedirect
from django.conf import settings
from django.contrib.auth.models import User
from django.contrib.auth.mixins import PermissionRequiredMixin
from django.core.files.storage import FileSystemStorage
from django.shortcuts import render
from django.urls import reverse
from django.views import View
from django.views.generic import DetailView, ListView, CreateView
from formtools.wizard.views import NamedUrlSessionWizardView
from .models import Area, RedListLevel, Bird, Photo, Sighting, SpeciesList

DEFAULT_LAYOUT = 'layouts/default.jinja'

# ===============================
# Setup
# ===============================
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
  
class GenericCreateView(CreateView):
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

class PhotoAddView(PermissionRequiredMixin, GenericCreateView):
  model = Photo
  permission_required = "bofz.can_add_photo"
  template_name = "photos/add.jinja"
  login_url = "log-in"
  fields = "__all__"
  

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


class SightingAddView(PermissionRequiredMixin, GenericCreateView):
  model = Sighting
  permission_required = "bofz.can_add_sighting"
  template_name = "sightings/add.jinja"
  login_url = "log-in"
  fields = "__all__"

  def get_context_data(self, **kwargs):
    context = super().get_context_data(**kwargs)
    context['all_birds'] = Bird.objects.all()
    context['all_people'] = User.objects.all()
    return context

# Persons
# ------------------
class PersonListView(GenericListView):
  model = User
  context_object_name = "persons"
  template_name = "persons/list.jinja"
  
class PersonDetailView(GenericDetailView):
  model = User
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


# Wizard: Create Sighting (and Photo) using `django-formtools`
# -----------------------------------------------------------
# See: https://django-formtools.readthedocs.io/en/latest/index.html
WIZARD_ADD_ENTRY_TEMPLATES = {
  'start':      "wizard/1_upload_photo.jinja",
	'photo':      "wizard/2_edit_photo.jinja",
	'location':   "wizard/3_edit_location.jinja",
	'birds':      "wizard/4_add_birds.jinja",
	'extra-info': "wizard/5_add_extra.jinja",
}

def skip_photo_upload(wizard):
  cleaned_data = wizard.get_cleaned_data_for_step('start') or {}
  return cleaned_data.get('source_photo') != None

class WizardAddEntryViews(NamedUrlSessionWizardView):
  file_storage = FileSystemStorage(location=os.path.join(settings.MEDIA_ROOT, 'wizard_photos'))

  # See: https://github.com/jazzband/django-formtools/issues/207

  def get_context_data(self, form, **kwargs):
    context = super().get_context_data(form=form, **kwargs)
    print("=========================")
    print("self.get_cleaned_data_for_step('start')", self.get_cleaned_data_for_step('start'))
    print("=========================")
    if self.steps.current == 'photo':
      previous_form_data = self.get_cleaned_data_for_step('start')
      context.update({'photo': '/media/wizard_photos/' + str(previous_form_data.get('source_photo')) })
    return context

  def get_form_step_data(self, form):
    print("=========================")
    print("form.data", form.data)
    print("=========================")
    return form.data
  # on step change:
  #   self.storage.set_step_data('start', {})
  def get_form_step_files(self, form):
    print("=========================")
    print("form.files", form.files)
    print("=========================")
    return form.files

  def get_template_names(self):
    return [WIZARD_ADD_ENTRY_TEMPLATES[self.steps.current]]

  def done(self, form_list, **kwargs):
    print("form_list", form_list)
    # Photo.save()
    # Sighting.save()
    return HttpResponseRedirect(reverse('wizard_done'))


class WizardAddEntryDoneView(GenericView):
  template_name = "wizard/6_done.jinja"
  
  def get(self, request):
    return self.simple_get(request)

