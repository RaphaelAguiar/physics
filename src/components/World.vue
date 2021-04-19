<template>
  <div>
    <Dot
      v-for="(dot, i) in dots"
      :key="i"
      :events="dot.events"
      :mass="dot.mass"
      :charge="dot.charge"
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

const baseH = 150;
const baseV = 125;

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
            velocity: [-1, 0],
            position: [baseH, baseV + 100],
          },
          name: "q1",
          mass: 1,
          charge: 0,
          events: new EventEmitter(),
        },
        {
          model: {
            velocity: [0, 0],
            position: [baseH, baseV],
          },
          name: "q2",
          mass: 100000000000000,
          charge: 0,
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