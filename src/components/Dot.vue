<template>
  <div :style="{ bottom: `${position[0]}px`, left: `${position[1]}px` }">
    <div class="label">v: {{ formatVector(velocity, 2) }}</div>
  </div>
</template>

<script>
import { formatVector } from "../helpers";
import { TICKS_PER_SECOND, PIXEL_PER_METER } from "../consts";

export default {
  props: ["mass", "events"],
  created() {
    this.events.on("applyAcceleration", (a) => {
      a.forEach((aMeterPerSecond, i) => {
        const aMeterPerTick = aMeterPerSecond / TICKS_PER_SECOND;
        const aPixelPerTick = aMeterPerTick * PIXEL_PER_METER;
        this.velocity[i] += aPixelPerTick;
      });
    });
    this.events.on("tick", () => {
      this.position = this.position.map((pi, i) => {
        const pf = pi + this.velocity[i];
        console.log(formatVector([pi,pf,pf-pi],2))
        return pf;
      });
      //console.log(this.velocity);
    });
  },
  destroyed() {
    this.events.removeAllListeners();
  },
  data() {
    return {
      position: [500, 100],
      //meters per tick
      velocity: [0, 0],
    };
  },
  methods: {
    formatVector,
  }
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