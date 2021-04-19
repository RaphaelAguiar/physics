<template>
  <div
    :style="{
      bottom: `${sPosition[1]}px`,
      left: `${sPosition[0]}px`,
    }"
  >
    <div class="label">
      {{ name }}
      <!-- v: {{  value.velocity }} -->
      <!-- gf: {{ gravitacionalInteraction.force }}  -->
      <!-- mf: {{ magnectInteraction.force }} -->
      d: {{ distance.toFixed(2) }} s: {{ speed.toFixed(2) }} epg:
      {{ energy.potentialGravitational.toFixed(2) }} ek:
      {{ energy.kinect.toFixed(2) }} e:
      {{ (energy.potentialGravitational + energy.kinect).toFixed(2) }}
    </div>
  </div>
</template>

<script>
import {
  formatVector,
  distanceBetwenPoints,
  calculateVectorDirection,
} from "../helpers";
import { G, K, METER_PER_PIXEL, TICKS_PER_SECOND } from "../consts";

export default {
  props: ["mass", "events", "value", "name", "charge"],
  data() {
    return {
      speed: 0,
      distance: 0,
      energy: {
        kinect: 0,
        potentialGravitational: 0,
      },
      gravitacionalInteraction: {
        force: 0,
      },
      magnectInteraction: {
        force: 0,
      },
    };
  },
  created() {
    this.events.on("interact", (dot) => {
      this.gravitationalInteract(dot);
      this.magnectInteract(dot);
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
        const aMeterPerTick = aMeterPerSecond / TICKS_PER_SECOND;
        //console.log(aMeterPerTick)
        this.value.velocity[i] += aMeterPerTick;
      });
    },
    gravitationalInteract(dot) {
      const distance = distanceBetwenPoints(
        dot.model.position,
        this.value.position
      );
      this.distance = distance;

      const LG = G;
      const m = this.mass;
      const M = dot.mass;
      const force = LG * ((M * m) / Math.pow(distance, 2));
      const direction = calculateVectorDirection(
        dot.model.position,
        this.value.position
      );
      const forceVector = direction.map((d) => d * force);
      this.applyForce(forceVector);

      this.gravitacionalInteraction.force = force;

      const speed = distanceBetwenPoints([0, 0], this.value.velocity);
      this.speed = speed;

      this.energy.kinect = (m*Math.pow(speed,2)) / 2;

      this.energy.potentialGravitational = (-LG *  M * m ) / distance;
    },
    magnectInteract(dot) {
      const distance = distanceBetwenPoints(
        dot.model.position,
        this.value.position
      );
      const LK = K;
      const Q = this.charge;
      const q = dot.charge;
      if (!Q || !q) {
        return;
      }
      const force = LK * ((Math.abs(Q) * Math.abs(q)) / Math.pow(distance, 2));
      const direction =
        (Q > 0 && q > 0) || (Q < 0 && q < 0)
          ? calculateVectorDirection(this.value.position, dot.model.position)
          : calculateVectorDirection(dot.model.position, this.value.position);
      this.applyForce(direction.map((d) => d * force));
      this.magnectInteraction.force = force;
    },
  },
  computed: {
    sPosition() {
      const position = this.value.position;
      const retorno = position.map((p) => {
        return p * METER_PER_PIXEL;
      });
      //console.log(position,retorno);
      return retorno;
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