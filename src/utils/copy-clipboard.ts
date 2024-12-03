import { toast } from "sonner";

export const copyToClipboard = async (text: string) => {
  try {
    if ("clipboard" in navigator) {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard");
      return;
    } else {
      const textArea = document.createElement("textarea");
      textArea.style.position = "fixed";
      textArea.style.top = "0";
      textArea.style.left = "-9999px";
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      textArea.remove();
      toast.success("Copied to clipboard");
    }
  } catch (error) {
    console.error(error);
    alert("Failed to copy to clipboard");
  }
};
