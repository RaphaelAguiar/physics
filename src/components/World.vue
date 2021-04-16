<template>
  <div>
    <Dot
      v-for="(dot, i) in dots"
      :key="i"
      :events="dot.events"
      :mass="dot.mass"
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
          mass: 1,
          events: new EventEmitter(),
        },
      ],
      enviroment: {
        gravity: 9.8,
      },
    };
  },
  mounted() {
    const tick = () => {
      this.dots.forEach((dot) => {
        dot.events.emit("applyAcceleration", [-this.enviroment.gravity, 0]);
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