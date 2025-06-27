<script setup>
import { useField } from 'vee-validate'
import { ref, watch } from 'vue'

const props = defineProps({
  label: String,
  placeholder: String,
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: "text",
  },
  modelValue: String,
  labelClass: String,
  inputClass: String,
  disabled: Boolean,
  clearable: Boolean,
});

const { value, errorMessage } = useField(() => props.name);

// Local "display" value
const displayValue = ref('');

watch(value, (newVal) => {
  displayValue.value = newVal ?? '';
}, { immediate: true });


// Input event handler
const onInput = (e) => {
  let rawVal = e.target.value.replace(/,/g, ''); // remove commas

  value.value = rawVal; // update vee-validate model (not formatted)

  displayValue.value = rawVal;
};

const onKeyDown = (e) => {
  if (props.disabled) return;

  const allowedKeys = [
    'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Home', 'End'
  ];

  // Allow digits always
  if (/\d/.test(e.key)) return;

  // Allow special control keys
  if (allowedKeys.includes(e.key)) return;

  // If anything else (like a letter), block it
  e.preventDefault();
};
</script>

<template>
  <div>
    <label class="block mb-2 text-md font-bold" :class="[labelClass, { '!text-red': errorMessage }]">{{ label }}</label>
    <div class="relative mb-1">
      <input
          :value="displayValue"
          :type="type"
          :placeholder="placeholder"
          :clearable="clearable"
          :disabled="disabled"
          @input="onInput"
          @keydown="onKeyDown"
          :class="[inputClass, { '!border-red focus:outline-none focus:ring-red': errorMessage }]"
          class="border text-2xl font-bold rounded-lg block w-40 p-4 transition duration-300"
      />
      <slot name="prefix" />
      <slot name="suffix" />

      <div v-if="clearable && value"
           class="flex absolute inset-y-0 right-0 items-center pr-3 cursor-pointer"
           @click="() => { value = ''; }"
      >
        <svg
            class="w-5 h-5 text-neutral-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
          <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
    </div>
    <div class="h-3 mb-2">
      <transition name="fade">
        <span v-if="errorMessage" class="text-red block text-sm">{{ errorMessage }}</span>
      </transition>
    </div>
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
