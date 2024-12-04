const renderTemplate = (formData) => {
	let description = formData.get('description').replace('\n\n', '\n').replace('\n', '\n  ');
	let formattedDate = `${ formData.get('datetime') }+02:00`;
	let content = `\
datetime: ${ formattedDate }
description: |-
  ${ description }
bird:
  id: ${ formData.get('species') }
  quantity: ${ formData.get('quantity') }
observers:
  - shaun
location:
  area: ${ formData.get('area') }
  latitude: ${ formData.get('latitude') }
  longitude: ${ formData.get('longitude') }
`;
	return content;
};

const bytesToBase64 = (bytes) => {
  const binString = Array.from(bytes, (byte) =>
    String.fromCodePoint(byte),
  ).join('');
  return btoa(binString);
};

const createSightingBlob = (formData) => {
	const content = renderTemplate(formData);
	const base64Contents = bytesToBase64(new TextEncoder().encode(content));
	if (base64Contents) {
		return base64Contents;
	} else {
		return null;
	}
};

export default createSightingBlob;