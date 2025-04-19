from django.shortcuts import render
from django.views import View

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

# ===============================
# Views
# ===============================

class Home(GenericView):
  def __init__(self):
    self.page_name = 'Home'
    self.page_description = 'A community birding project'
    
  def get(self, request):
    return render(request, 'index.jinja', self.get_context())

class Sightings(GenericView):
  def __init__(self):
    self.page_name = 'Sightings'
    self.page_description = 'Most recent sightings of birds'
    
  def get(self, request):
    extra_context = {}
    return render(request, 'sightings/list.jinja', self.get_context(extra_context))
