import { ref } from 'vue'

export function useCountUp(initialValue = 0, duration = 1000) {
    const current = ref(initialValue)

    const start = (target: number) => {
        const startTime = performance.now()
        const startVal = current.value

        const animate = (now: number) => {
            const progress = Math.min((now - startTime) / duration, 1)
            current.value = Math.floor(startVal + (target - startVal) * progress)
            if (progress < 1) requestAnimationFrame(animate)
        }

        requestAnimationFrame(animate)
    }

    return { current, start }
}
