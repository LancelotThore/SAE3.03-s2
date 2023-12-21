import { handlerClick } from "../main";

let V = {};

let all = document.querySelector('.all');
all.addEventListener("change", handlerClick);

export { V };