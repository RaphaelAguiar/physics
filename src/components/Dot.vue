<template>
  <div
    :style="{
      bottom: `${value.position[1]}px`,
      left: `${value.position[0]}px`,
    }"
  >
    <div class="label">
      <!--v: {{ formatVector(value.velocity, 2) }} -->
    </div>
  </div>
</template>

<script>
import {
  formatVector,
  distanceBetwenPoints,
  calculateVectorDirection,
} from "../helpers";
import { G, TICKS_PER_SECOND, PIXEL_PER_METER } from "../consts";

export default {
  props: ["mass", "events", "value", "name"],
  created() {
    this.events.on("applyAcceleration", (a) => {
      this.applyAcceleration(a);
    });
    this.events.on("interact", (dot) => {
      gravitationalInteract(dot);
    });
    this.events.on("tick", () => {
      this.value.position = this.value.position.map((pi, i) => {
        const pf = pi + this.value.velocity[i];
        return pf;
      });
    });
  },
  destroyed() {
    this.events.removeAllListeners();
  },
  methods: {
    formatVector,
    applyForce(f) {
      const a = f.map((f) => {
        const m = this.mass;
        const a = f / m;
        return a;
      });
      this.applyAcceleration(a);
    },
    applyAcceleration(a) {
      a.forEach((aMeterPerSecond, i) => {
        const aMeterPerTick = aMeterPerSecond / TICKS_PER_SECOND;
        const aPixelPerTick = aMeterPerTick * PIXEL_PER_METER;
        this.value.velocity[i] += aPixelPerTick;
      });
    },
    gravitationalInteract(dot) {
      const distance = distanceBetwenPoints(
        dot.model.position,
        this.value.position
      );
      const LG = G;
      const M = this.mass;
      const m = dot.mass;
      const force = (LG * M * m) / Math.pow(distance, 2);
      const direction = calculateVectorDirection(
        dot.model.position,
        this.value.position
      );
      this.applyForce(direction.map((d) => d * force));
    },
  },
};
</script>

<style scoped>
div {
  position: absolute;
  width: 5px;
  height: 5px;
  background-color: red;
  border-radius: 3px;
}
.label {
  width: max-content;
  background: unset;
}
</style>