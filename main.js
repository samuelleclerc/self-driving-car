const canvas = document.getElementById("canvas");
canvas.width = 200;

const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 500;

const context = canvas.getContext("2d");
const networkContext = networkCanvas.getContext("2d");

const road = new Road(canvas.width / 2, canvas.width * 0.9);

const N = 1000;
const cars = generateCars(N);
let bestCar = cars[0];

if (localStorage.getItem("bestBrain")) {
  for (let i = 0; i < cars.length; i++) {
    cars[i].brain = JSON.parse(localStorage.getItem("bestBrain"));
    if (i !== 0) {
      NeuralNetwork.mutate(cars[i].brain, 0.2);
    }
  }
}

const traffic = [
  new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(0), -300, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(2), -300, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(0), -500, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(1), -500, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(1), -700, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(2), -700, 30, 50, "DUMMY", 2),
];

animate();

function save() {
  localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
}

function discard() {
  localStorage.removeItem("bestBrain");
}

function generateCars(n) {
  const cars = [];
  for (let i = 1; i <= n; i++) {
    cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"));
  }

  return cars;
}

function animate(time) {
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(road.borders, []);
  }

  for (const car of cars) {
    car.update(road.borders, traffic);
  }

  bestCar = cars.find((car) => car.y === Math.min(...cars.map((car) => car.y)));

  canvas.height = window.innerHeight;
  networkCanvas.height = window.innerHeight;

  context.save();
  context.translate(0, -bestCar.y + canvas.height * 0.7);

  road.draw(context);
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].draw(context, "red");
  }

  context.globalAlpha = 0.2;
  for (const car of cars) {
    car.draw(context);
  }
  context.globalAlpha = 1;
  bestCar.draw(context, true);

  context.restore();

  networkContext.lineDashOffset = -time / 100;
  Visualizer.drawNetwork(networkContext, bestCar.brain);
  requestAnimationFrame(animate);
}
