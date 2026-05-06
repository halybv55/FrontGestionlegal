import axios from "axios";

const api = axios.create({
  baseURL: "https://gestionlegal-production.up.railway.app/api"
});

export default api;