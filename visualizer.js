class Visualizer {
  static drawNetwork(context, network) {
    const margin = 50;
    const left = margin;
    const top = margin;
    const width = context.canvas.width - margin * 2;
    const height = context.canvas.height - margin * 2;

    const levelHeight = height / network.levels.length;

    for (let i = network.levels.length - 1; i >= 0; i--) {
      const levelTop =
        top +
        linearInterpolation(
          height - levelHeight,
          0,
          network.levels.length === 1 ? 0.5 : i / (network.levels.length - 1)
        );

      context.setLineDash([7, 3]);
      Visualizer.drawLevel(
        context,
        network.levels[i],
        left,
        levelTop,
        width,
        levelHeight,
        i === network.levels.length - 1
          ? ["\u21E7", "\u21E6", "\u21E8", "\u21E9"]
          : []
      );
    }
  }

  static drawLevel(context, level, left, top, width, height, outputLabels) {
    const right = left + width;
    const bottom = top + height;

    const { inputs, outputs, weights, biases } = level;

    const nodeRadius = 18;

    for (let i = 0; i < inputs.length; i++) {
      for (let j = 0; j < outputs.length; j++) {
        context.beginPath();
        context.moveTo(Visualizer.#getNodeX(inputs, i, left, right), bottom);
        context.lineTo(Visualizer.#getNodeX(outputs, j, left, right), top);
        context.lineWidth = 2;
        context.strokeStyle = getRGBA(weights[i][j]);
        context.stroke();
      }
    }

    for (let i = 0; i < inputs.length; i++) {
      const x = Visualizer.#getNodeX(inputs, i, left, right);

      context.beginPath();
      context.arc(x, bottom, nodeRadius, 0, Math.PI * 2);
      context.fillStyle = "black";
      context.fill();

      context.beginPath();
      context.arc(x, bottom, nodeRadius * 0.6, 0, Math.PI * 2);
      context.fillStyle = getRGBA(inputs[i]);
      context.fill();
    }

    for (let i = 0; i < outputs.length; i++) {
      const x = Visualizer.#getNodeX(outputs, i, left, right);

      context.beginPath();
      context.arc(x, top, nodeRadius, 0, Math.PI * 2);
      context.fillStyle = "black";
      context.fill();

      context.beginPath();
      context.arc(x, top, nodeRadius * 0.6, 0, Math.PI * 2);
      context.fillStyle = getRGBA(outputs[i]);
      context.fill();

      context.beginPath();
      context.lineWidth = 2;
      context.arc(x, top, nodeRadius * 0.8, 0, Math.PI * 2);
      context.strokeStyle = getRGBA(biases[i]);
      context.setLineDash([3, 3]);
      context.stroke();
      context.setLineDash([]);

      if (outputLabels[i]) {
        context.beginPath();
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillStyle = "black";
        context.strokeStyle = "white";
        context.font = nodeRadius * 1.5 + "px Arial";
        context.fillText(outputLabels[i], x, top + nodeRadius * 0.1);
        context.lineWidth = 0.5;
        context.strokeText(outputLabels[i], x, top + nodeRadius * 0.1);
      }
    }
  }

  static #getNodeX(nodes, index, left, right) {
    return linearInterpolation(
      left,
      right,
      nodes.length === 1 ? 0.5 : index / (nodes.length - 1)
    );
  }
}
