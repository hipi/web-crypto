<template>
  <div class="progress-line progress-status-active">
    <div class="progress-bg">
      <div
        class="progress-in"
        :style="`width: ${percentNumber}%; height: ${strokeWidth}px;background-color:${strokeColor}`"
      ></div>
    </div>
    <div v-if="showInfo" class="percent-text">{{ percentNumber }}%</div>
  </div>
</template>

<script>
export default {
  props: {
    showInfo: {
      type: Boolean,
      default: false,
    },
    percent: [String, Number],

    strokeWidth: {
      type: Number,
      default: 10,
    },
    strokeColor: {
      type: String,
    },
  },
  data() {
    return {};
  },
  computed: {
    percentNumber() {
      return parseInt(this.percent.toString()) > 100
        ? 100
        : parseInt(this.percent.toString());
    },
  },
  methods: {},
};
</script>
<style lang="css" scoped>
@keyframes progress-active {
  0% {
    width: 0;
    opacity: 0.1;
  }
  20% {
    width: 0;
    opacity: 0.5;
  }
  100% {
    width: 100%;
    opacity: 0;
  }
}
.progress-line {
  display: flex;
  align-items: center;
  padding: 6px 0;
}
.progress-bg {
  background-color: #f5f5f5;
  border-radius: 100px;
  display: inline-block;
  width: 100%;
  overflow: hidden;
}
.progress-in {
  position: relative;
  border-radius: 100px;
  transition: all 0.4s cubic-bezier(0.08, 0.82, 0.17, 1) 0s;
  background-image: linear-gradient(
    to right,
    rgb(16, 142, 233),
    rgb(135, 208, 104)
  );
}
.progress-in::after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: #fff;
  border-radius: 10px;
  opacity: 0;
  animation: progress-active 2.4s cubic-bezier(0.23, 1, 0.32, 1) infinite;
}
.percent-text {
  padding-left: 10px;
}
</style>
