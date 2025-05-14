from django import forms

class WizardUploadPhotoForm(forms.Form):
  source_photo = forms.ImageField(required=False)


class WizardEditPhotoForm(forms.Form):
  datetime = forms.DateTimeField()
  description = forms.CharField(max_length=256)
  photographer = forms.CharField()


class WizardEditLocationForm(forms.Form):
  area = forms.ChoiceField()
  latitude = forms.FloatField()
  longitude = forms.FloatField()


class WizardAddBirdsForm(forms.Form):
  birds = forms.MultipleChoiceField()
  quantities = forms.IntegerField()


class WizardAddExtraForm(forms.Form):
  observers = forms.MultipleChoiceField()
