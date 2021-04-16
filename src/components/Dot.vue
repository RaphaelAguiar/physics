<template>
  <div
    :style="{
      bottom: `${sPosition[1]}px`,
      left: `${sPosition[0]}px`,
    }"
  >
    <div class="label">
      {{name}}
      <!-- v: {{ formatVector(value.velocity, 2) }}  -->
      </div>
  </div>
</template>

<script>
import {
  formatVector,
  distanceBetwenPoints,
  calculateVectorDirection,
} from "../helpers";
import { G, METER_PER_PIXEL, TICKS_PER_SECOND } from "../consts";

export default {
  props: ["mass", "events", "value", "name"],
  created() {
    this.events.on("interact", (dot) => {
      this.gravitationalInteract(dot);
    });
    this.events.on("tick", () => {
      this.value.position = this.value.position.map((pi, i) => {
        const pf = pi + this.value.velocity[i];
        return pf;
      });
      //console.log(this.value.position);
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
      //console.log(a)
      a.forEach((aMeterPerSecond, i) => {
        const aMeterPerTick = aMeterPerSecond / TICKS_PER_SECOND
        //console.log(aMeterPerTick)
        this.value.velocity[i] += aMeterPerTick;
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
      const force = LG * ((M * m) / Math.pow(distance, 2));
      const direction = calculateVectorDirection(
        dot.model.position,
        this.value.position
      );
      this.applyForce(direction.map((d) => d * force));
    },
  },
    computed: {
      sPosition() {
        const position = this.value.position;
        const retorno = position.map((p) => {
          return p * METER_PER_PIXEL;
        });
        //console.log(position,retorno);
        return retorno
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