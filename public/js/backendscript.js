//for web-worker
let worker = new Worker("/js/web-worker.js");
let inputs = document.getElementsByClassName("input-file");

for (let i = 0; i < inputs.length; i++) {
  inputs[i].addEventListener("change", () => {
    worker.postMessage(inputs[i].files[0]);
  });
}

worker.onmessage = (event) => {
  console.log(event.data);
};
