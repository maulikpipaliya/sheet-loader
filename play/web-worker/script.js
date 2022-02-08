var worker;

const init = () => {
    console.log("Initializing web-worker");
    worker = new Worker("./web-worker.js");

    worker.onmessage = receivedWorkerMessage;
    worker.onerror = receivedWorkerError;

    worker.postMessage({
        name: "Maulik",
        surname: "Pipaliya",
    });
};

const receivedWorkerMessage = (event) => {
    console.log(event.data);
};

const receivedWorkerError = (event) => {
    console.log(event.data);
};

const stopWorker = () => {
    worker.terminate();
    worker = null;
};
