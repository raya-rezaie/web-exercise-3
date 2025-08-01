const API_BASE_URL = 'http://localhost:8080/api'; 
export const paintingApi = {
  savePainting: async (userId, title, shapes) => {
    const response = await fetch(`${API_BASE_URL}/paintings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors',
      body: JSON.stringify({
        userId,                
        title,
        shapesData: JSON.stringify(shapes),
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Failed to save painting: ${errorBody}`);
    }

    return await response.json();
  },

  getPaintings: (userId) =>
    fetch(`${API_BASE_URL}/paintings/${userId}`).then((res) => res.json()),

  getUsers: () =>
    fetch(`${API_BASE_URL}/users`).then((res) => res.json()),
};
