"""
URL configuration for bofz project.

The `urlpatterns` list routes URLs to views. For more information please see:
  https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
  1. Add an import:  from my_app import views
  2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
  1. Add an import:  from other_app.views import Home
  2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
  1. Import the include() function: from django.urls import include, path
  2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import path
from .views import (
  ViewHome,
  ViewAbout,
  ViewAttribution,
  AreaListView,
  AreaDetailView,
  BirdListView,
  BirdDetailView,
  PhotoListView,
  PhotoDetailView,
  SightingListView,
  SightingDetailView,
  PersonListView,
  PersonDetailView,
  SpeciesListListView,
  SpeciesListDetailView,
)

urlpatterns = [
  path("", ViewHome.as_view(), name="home"),
  path("about/", ViewAbout.as_view(), name="about"),
  path("areas/", AreaListView.as_view(), name="areas_list"),
  path("areas/<int:pk>/", AreaDetailView.as_view(), name="area_detail"),
  path("attribution/", ViewAttribution.as_view(), name="attribution"),
  path("birds/", BirdListView.as_view(), name="birds_list"),
  path("birds/<int:pk>/", BirdDetailView.as_view(), name="bird_detail"),
  path("persons/", PersonListView.as_view(), name="persons_list"),
  path("persons/<int:pk>/", PersonDetailView.as_view(), name="person_detail"),
  path("photos/", PhotoListView.as_view(), name="photos_list"),
  path("photos/<int:pk>/", PhotoDetailView.as_view(), name="photo_detail"),
  path("sightings/", SightingListView.as_view(), name="sightings_list"),
  path("sightings/<int:pk>/", SightingDetailView.as_view(), name="sighting_detail"),
  path("species-lists/", SpeciesListListView.as_view(), name="species_lists_list"),
  path("species-lists/<int:pk>/", SpeciesListDetailView.as_view(), name="species_list_detail"),
]
