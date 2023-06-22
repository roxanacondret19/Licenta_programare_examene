export default function ({ $axios }, inject) {
  // Create a custom axios instance
  const instance = $axios.create({
      baseURL: "http://localhost:8081",
      withCredentials: true,
      headers: {
          ...$axios.defaults.headers,
          Cache: "no-cache",
          "X-CSRF-TOKEN": "",
      },
      timeout: undefined,
      cancelToken: undefined,
  });

  instance.interceptors.response.use(
      (res) => res,
      (error) => {
          if (error.config) {
              console.error(
                  "DEBUG",
                  error.config.method.toUpperCase(),
                  error.config.url,
                  error.response ? error.response.data : "No response"
              );
          } else {
              console.error(error);
          }
          return Promise.reject(error);
      }
  );


  // Inject to context as $api
  inject('api', instance)
}
