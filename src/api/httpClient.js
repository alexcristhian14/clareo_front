export const httpClient = {
  get: async (url) => {
    console.log("GET:", url);

    return new Promise((resolve) => {
      setTimeout(() => resolve({ data: null }), 300);
    });
  },

  post: async (url, body) => {
    console.log("POST:", url, body);

    return new Promise((resolve) => {
      setTimeout(() => resolve({ data: body }), 300);
    });
  },

  put: async (url, body) => {
    console.log("PUT:", url, body);

    return new Promise((resolve) => {
      setTimeout(() => resolve({ data: body }), 300);
    });
  },

  delete: async (url) => {
    console.log("DELETE:", url);

    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true }), 300);
    });
  },
};