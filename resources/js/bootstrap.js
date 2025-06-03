import axios from "axios";
import { Buffer } from "buffer";
window.axios = axios;

window.axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

window.Buffer = Buffer;
