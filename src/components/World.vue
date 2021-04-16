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
  </div>
</template>

<script>
import { EventEmitter } from "events";
import { TICKS_PER_SECOND } from "../consts";
import Dot from "./Dot.vue";

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
            velocity: [0, -1.5],
            position: [200, 300],
          },
          name: "earth",
          mass: 5.972 * Math.pow(24, 10),
          events: new EventEmitter(),
        },
        {
          model: {
            velocity: [0, 3],
            position: [300, 300],
          },
          name: "moon",
          //mass: 5.972 * Math.pow(24,10),
          mass: 7.34767309 * Math.pow(22, 10),
          events: new EventEmitter(),
        },
      ],
      enviroment: {
        gravity: 0,
      },
    };
  },
  mounted() {
    const tick = () => {
      this.dots.forEach((dot) => {
        dot.events.emit("applyAcceleration", [-this.enviroment.gravity, 0]);

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
    };
    tick();
    setInterval(tick, TICKS_PER_SECOND);
    //setInterval(tick, 1000);
  },
};
</script>