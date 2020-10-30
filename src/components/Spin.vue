<template>
  <div class="spin-nested-loading">
    <div v-if="spinning" class="spin spin-spinning">
      <span class="spin-dot spin-dot-spin">
        <i class="spin-dot-item"></i>
        <i class="spin-dot-item"></i>
        <i class="spin-dot-item"></i>
        <i class="spin-dot-item"></i>
      </span>
    </div>
    <div class="spin-container" :class="spinning ? 'spin-blur' : ''">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    spinning: Boolean,
  },
};
</script>
<style lang="scss" scoped>
@keyframes rotate {
  to {
    transform: rotate(405deg);
  }
}
@keyframes spinMove {
  to {
    opacity: 1;
  }
}
.spin-nested-loading {
  position: relative;
}
.spin-spinning {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 4;
  display: block;
  width: 100%;
  height: 100%;
  .spin-dot {
    position: relative;
    display: inline-block;
    font-size: 20px;
    width: 1em;
    height: 1em;
    position: absolute;
    top: 45%;
    left: 50%;
    margin: -10px;
    .spin-dot-item {
      position: absolute;
      display: block;
      width: 9px;
      height: 9px;
      background-color: #1890ff;
      border-radius: 100%;
      transform: scale(0.75);
      transform-origin: 50% 50%;
      opacity: 0.3;
      animation: spinMove 1s infinite linear alternate;
    }
    .spin-dot-item:nth-child(1) {
      top: 0;
      left: 0;
    }
    .spin-dot-item:nth-child(2) {
      top: 0;
      right: 0;

      animation-delay: 0.4s;
    }
    .spin-dot-item:nth-child(3) {
      right: 0;
      bottom: 0;

      animation-delay: 0.8s;
    }
    .spin-dot-item:nth-child(4) {
      bottom: 0;
      left: 0;

      animation-delay: 1.2s;
    }
  }
}
.spin-dot-spin {
  transform: rotate(45deg);
  animation: rotate 1.2s infinite linear;
}

.spin-container {
  transition: opacity 0.3s;
  position: relative;
}
.spin-blur {
  overflow: hidden;
  opacity: 0.4;
  user-select: none;
  pointer-events: none;
}
</style>
