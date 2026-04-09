import { computed, onBeforeUnmount, ref, toValue, watch, type MaybeRefOrGetter } from 'vue';

interface TypewriterOptions {
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseMs?: number;
  initialDelayMs?: number;
}

export const useTypewriter = (
  source: MaybeRefOrGetter<string[]>,
  options: TypewriterOptions = {},
) => {
  const {
    typingSpeed = 70,
    deletingSpeed = 36,
    pauseMs = 1800,
    initialDelayMs = 250,
  } = options;

  const text = ref('');
  const currentIndex = ref(0);
  const isDeleting = ref(false);
  const normalizeItems = (value: unknown): string[] => {
    if (Array.isArray(value)) {
      return value.filter((item): item is string => typeof item === 'string' && item.length > 0);
    }

    if (typeof value === 'string' && value.length > 0) {
      return [value];
    }

    if (value && typeof value === 'object') {
      return Object.values(value)
        .filter((item): item is string => typeof item === 'string' && item.length > 0);
    }

    return [];
  };

  const items = computed(() => normalizeItems(toValue(source)));

  let timer: ReturnType<typeof globalThis.setTimeout> | null = null;

  const clearTimer = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  };

  const queueNextStep = (delay: number) => {
    clearTimer();
    timer = globalThis.setTimeout(step, delay);
  };

  const step = () => {
    if (!import.meta.client) {
      text.value = items.value[0] ?? '';
      return;
    }

    const currentWord = items.value[currentIndex.value] ?? '';

    if (!currentWord) {
      text.value = '';
      return;
    }

    if (isDeleting.value) {
      text.value = currentWord.slice(0, Math.max(0, text.value.length - 1));

      if (text.value.length === 0) {
        isDeleting.value = false;
        currentIndex.value = (currentIndex.value + 1) % items.value.length;
        queueNextStep(typingSpeed);
        return;
      }

      queueNextStep(deletingSpeed);
      return;
    }

    text.value = currentWord.slice(0, text.value.length + 1);

    if (text.value === currentWord) {
      isDeleting.value = true;
      queueNextStep(pauseMs);
      return;
    }

    queueNextStep(typingSpeed);
  };

  watch(
    items,
    (value) => {
      clearTimer();
      currentIndex.value = 0;
      isDeleting.value = false;
      text.value = '';

      if (!value.length) {
        return;
      }

      if (!import.meta.client) {
        text.value = value[0] ?? '';
        return;
      }

      queueNextStep(initialDelayMs);
    },
    { immediate: true },
  );

  onBeforeUnmount(clearTimer);

  return {
    text,
  };
};

