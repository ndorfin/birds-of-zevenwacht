from django.shortcuts import render
from django.views import View
from django.views.generic import DetailView, ListView
from .models import Sighting

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
  layout = 'layouts/default.jinja'
  
  def get_context_data(self, **kwargs):
    # Call the base implementation first to get a context
    context = super().get_context_data(**kwargs)
    # Add extra context data
    context["layout"] = self.layout
    return context

class GenericDetailView(DetailView):
  layout = 'layouts/default.jinja'
  
  def get_context_data(self, **kwargs):
    # Call the base implementation first to get a context
    context = super().get_context_data(**kwargs)
    # Add extra context data
    context["layout"] = self.layout
    return context


# ===============================
# Views
# ===============================

class ViewHome(GenericView):
  def __init__(self):
    self.page_name = 'Home'
    self.page_description = 'A community birding project'
    
  def get(self, request):
    return render(request, 'index.jinja', self.get_context())

class SightingListView(GenericListView):
  model = Sighting
  context_object_name = "sightings"
  template_name = "sightings/list.jinja"
  
class SightingDetailView(GenericDetailView):
  model = Sighting
  context_object_name = "sighting"
  template_name = "sightings/detail.jinja"
