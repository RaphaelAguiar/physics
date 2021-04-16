<template>
  <div>
    <Dot
      v-for="(dot, i) in dots"
      :key="i"
      :events="dot.events"
      :mass="dot.mass"
      :name="dot.name"
      v-model="dot.model"
    ></Dot>
    <div class="ground"></div>
  </div>
</template>

<script>
import { EventEmitter } from "events";
import { TICKS_PER_SECOND, SIMULATION_SPEED } from "../consts";
import Dot from "./Dot.vue";

const base = 500000000;

export default {
  name: "World",
  components: {
    Dot,
  },
  data() {
    return {
      dots: [
        {
          model: {
            velocity: [0, 0],
            position: [base, base],
          },
          name: "earth",
          mass: 5.972 * Math.pow(10, 24),
          events: new EventEmitter(),
        },
        {
          model: {
            velocity: [1.022 * 1000, 0],
            position: [base, base + 0.3844 * Math.pow(10, 6) * 1000],
          },
          name: "moon",
          mass: 0.07346 * Math.pow(10, 24),
          events: new EventEmitter(),
        },
      ],
    };
  },
  mounted() {
    let running = false;
    const tick = () => {
      if (running) {
        console.log("warn");
        return;
      }
      running = true;
      try {
        this.dots.forEach((dot) => {
          this.dots.forEach((sd) => {
            if (sd === dot) {
              return;
            }
            dot.events.emit("interact", sd);
          });
        });
        this.dots.forEach((dot) => {
          dot.events.emit("tick");
        });
      } finally {
        running = false;
      }
    };

    const t = 1000 / (TICKS_PER_SECOND * SIMULATION_SPEED);
    console.log("T: " + t);
    setInterval(tick, t);
  },
};
</script>

<style scoped>
.ground {
  position: absolute;
  bottom: 0px;
  height: 5px;
  width: 500px;
  background-color: red;
}
</style>