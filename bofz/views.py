from django.shortcuts import render
from django.views import View

class GenericView(View):
  layout = 'layouts/default.jinja'
  page_id = None
  page_name = None
  page_classes = [
    'generic',
  ]
  
  def get_context(self, additional_context = {}):
    context = {
      'page_id': self.page_id,
      'page_name': self.page_name,
      'layout': self.layout,
      **additional_context,
    }
    return context

class HomeView(GenericView):
  def __init__(self):
    self.page_name = 'Home'
    self.page_id = 'home'
    
  def get(self, request):
    extra_context = {}
    return render(request, 'index.jinja', self.get_context(extra_context))
