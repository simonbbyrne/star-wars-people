<template>
  <teleport to="body">
    <div class="modal" v-if="modalOpen" tabindex="-1" role="dialog">
      <div class="modal-inner">
        <CloseButton @click="close" class="close" />
        <!-- Modal Content -->
        <slot />
      </div>
    </div>
  </teleport>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import CloseButton from '@/components/CloseButton.vue';

export default defineComponent({
  props: {
    modalOpen: {
      required: true,
      type: Boolean as PropType<boolean>,
    },
  },
  components: {
    CloseButton,
  },
  emits: ['close'],
  setup(props, { emit }) {
    const close = () => {
      emit('close');
    };

    return {
      close,
    };
  },
});
</script>

<style lang="scss" scoped>
.modal {
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  &-inner {
    position: relative;
    background-color: #fff;
    max-width: 500px;
    width: 100%;
    padding: 50px 20px;
    border-radius: 5px;
    box-shadow: 0 3px 7px rgba(0, 0, 0, 0.3);
  }

  .close {
    position: absolute;
    cursor: pointer;
    top: 10px;
    right: 10px;
    width: 30px;
    height: 30px;
  }
}
</style>
