<script setup lang="ts">
import {ref} from "vue";
import {useForm, configure} from "vee-validate";
import {toTypedSchema} from "@vee-validate/yup";
import {string, object} from "yup";
import NumberInput from "./components/NumberInput.vue"
import { useCountUp } from './composables/useCountUp'


configure({
  validateOnModelUpdate: false,
  validateOnBlur: false,
  validateOnChange: true,
  bails: true,
});



const {handleSubmit} = useForm({
  validationSchema: toTypedSchema(
      object({
        day: string()
            .required("Day is required")
            .matches(/^\d+$/, "Day must be a number")
            .test("valid-day", "Invalid day for given month", function (value) {
              const {month, year} = this.parent;
              const day = parseInt(value || '');
              const m = parseInt(month || '');
              const y = parseInt(year || '');

              if (isNaN(day) || isNaN(m) || m < 1 || m > 12 || isNaN(y)) return true;

              const isLeap = (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
              const daysInMonth = [31, isLeap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

              return day >= 1 && day <= daysInMonth[m - 1];
            }),

        month: string()
            .required("Month is required")
            .matches(/^\d+$/, "Month must be a number")
            .test("valid-month", "Month must be between 1 and 12", val => {
              const m = parseInt(val || '');
              return m >= 1 && m <= 12;
            }),

        year: string()
            .required("Year is required")
            .matches(/^\d{4}$/, "Year must be a 4-digit number"),
      }).test("not-in-future", "Date cannot be in the future", function (values) {
        const {day, month, year} = values;

        const d = parseInt(day || '');
        const m = parseInt(month || '');
        const y = parseInt(year || '');

        if (isNaN(d) || isNaN(m) || isNaN(y)) return true;

        const inputDate = new Date(y, m - 1, d);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (inputDate > today) {
          // Determine which field is the cause
          if (y > today.getFullYear()) {
            return this.createError({path: "year", message: "Year cannot be in the future"});
          } else if (y === today.getFullYear() && m > (today.getMonth() + 1)) {
            return this.createError({path: "month", message: "Month cannot be in the future"});
          } else if (y === today.getFullYear() && m === (today.getMonth() + 1) && d > today.getDate()) {
            return this.createError({path: "day", message: "Day cannot be in the future"});
          }
        }

        return true;
      })
  ),
});


const ageYears = ref()
const ageMonths = ref()
const ageDays = ref()

const { current: animatedAgeYears, start: startYears } = useCountUp(0, 1000)
const { current: animatedAgeMonths, start: startMonths } = useCountUp(0, 1000)
const { current: animatedAgeDays, start: startDays } = useCountUp(0, 1000)


const calculateAge = handleSubmit((values) => {
  const {year, month, day} = values
  const today = new Date();

  const enteredDate = new Date(+year, +month - 1, +day);
  let ageY = today.getFullYear() - enteredDate.getFullYear();
  let ageM = today.getMonth() - enteredDate.getMonth();
  let ageD = today.getDate() - enteredDate.getDate();

  if (ageD < 0) {
    ageM -= 1;
    const previousMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    ageD += previousMonth.getDate(); // days in previous month
  }

  if (ageM < 0) {
    ageY -= 1;
    ageM += 12;
  }

  ageYears.value = ageY
  ageMonths.value = ageM
  ageDays.value = ageD

  startYears(ageY)
  startMonths(ageM)
  startDays(ageD)
});

</script>

<template>
  <div class="bg-grey-300 h-screen overflow-auto flex flex-col justify-between">
    <div class="container w-auto mx-5 md:mx-auto my-12 md:my-auto bg-white rounded-3xl rounded-br-[100px] md:max-w-3xl">
      <div class="bg-white p-6 md:p-12 rounded-3xl rounded-br-[200px]">
        <form @submit="calculateAge">
          <div class="flex gap-x-4 mb-0">
            <NumberInput
                label="Day"
                placeholder="DD"
                labelClass="text-grey-500"
                inputClass="bg-white text-black border border-grey-200"
                name="day"
                type="text"
            >
            </NumberInput>
            <NumberInput
                label="Month"
                placeholder="MM"
                labelClass="text-grey-500"
                inputClass="bg-white text-black border border-grey-200"
                name="month"
                type="text"
            >
            </NumberInput>
            <NumberInput
                label="Year"
                placeholder="YY"
                labelClass="text-grey-500"
                inputClass="bg-white text-black border border-grey-200"
                name="year"
                type="text"
            >
            </NumberInput>
          </div>

          <div class="flex items-center">
            <div class="h-[1px] w-full bg-grey-500"></div>
            <button type="submit"
                    class="cursor-pointer bg-purple w-fit font-bold p-2 md:p-4 rounded-full text-white">
              <img src="./assets/images/icon-arrow.svg" alt="arrow">
            </button>
          </div>

        </form>
        <div class="p-4 md:p-8">
          <div class="text-black text-5xl md:text-8xl font-bold">
            <span class="text-purple">{{ typeof ageYears === 'number' ? animatedAgeYears  : '--' }}</span> years
          </div>
          <div class="text-black text-5xl md:text-8xl font-bold">
            <span class="text-purple">{{ typeof ageMonths === 'number' ? animatedAgeMonths  : '--' }}</span> months
          </div>
          <div class="text-black text-5xl md:text-8xl font-bold">
            <span class="text-purple">{{ typeof ageDays === 'number' ? animatedAgeDays  : '--' }}</span> days
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
</style>
