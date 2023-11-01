const apiUrl = "https://654232d8f0b8287df1ffac32.mockapi.io/:endpoint";

fetch(apiUrl)
  .then(response => {
    if (!response.ok) {
      throw new Error('La respuesta no fue correcta');
    }
    return response.json();
  })
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error('Hubo un problema:', error);
  });

