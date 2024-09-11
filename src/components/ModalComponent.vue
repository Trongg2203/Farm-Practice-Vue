<template>
  <!-- @Click.self sự kiện click chỉ trên chính phần tử mà nó được gắn vào, và không bao gồm các sự kiện click xảy ra trên các phần tử con bên trong. -->
  <!-- Khi bạn muốn giới hạn sự kiện chỉ xảy ra trên chính phần tử đó mà không ảnh hưởng đến các phần tử con bên trong.
    Khi cần ngăn chặn các hành vi không mong muốn xảy ra khi người dùng tương tác với các phần tử con của một phần tử cha. -->
  <div v-if="isVisible" class="modal-overlay" @click.self="closeModal">
    <div class="modal-container">
      <div class="modal-header">
        <slot name="header">
          <!-- Slot cho phần header -->
          <h2>Default Header</h2>
        </slot>
        <button @click="closeModal" class="close-btn">&times;</button>
      </div>
      <div class="modal-body">
        <slot name="body">
          <!-- Slot cho phần body -->
          Default Body Content
        </slot>
      </div>
      <div class="modal-footer">
        <slot name="footer">
          <!-- Slot cho phần footer -->
          <button @click="closeModal" class="btn">Close</button>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

const props = defineProps<{ isVisible: boolean }>() // Thuộc tính để kiểm soát việc hiển thị Modal
const emit = defineEmits(['close']) // Emit sự kiện khi đóng modal

const closeModal = () => {
  emit('close') // Phát ra sự kiện 'close' khi đóng modal
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-container {
  background-color: white;
  padding: 1rem;
  border-radius: 8px;
  max-width: 600px;
  width: 100%;
}

.modal-header,
.modal-body,
.modal-footer {
  margin-bottom: 1rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
}
</style>
