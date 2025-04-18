from django.shortcuts import render

context = {
	'layout': 'layouts/default.jinja'
}

def home(request):
	return render(request, 'index.jinja', context)
