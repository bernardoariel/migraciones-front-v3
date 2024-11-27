import { ref } from 'vue';
export function useTypingEffect(fullText: string, typingSpeed = 100) {
  const displayedText = ref('');
  const showCursor = ref(true);

  const startTyping = async () => {
    for (let i = 0; i <= fullText.length; i++) {
      displayedText.value = fullText.slice(0, i);
      await new Promise((resolve) => setTimeout(resolve, typingSpeed));
    }
    showCursor.value = false;
  };

  return {
    displayedText,
    showCursor,
    startTyping,
  };
}
