import { useState } from "react";

export default function useDownloadButton() {
  const [state, setState] = useState("idle");

  async function trigger(fn) {
    if (state !== "idle") return;
    setState("loading");
    try {
      await fn();
      setState("success");
      setTimeout(() => setState("idle"), 2000);
    } catch (err) {
      setState("idle");
      throw err;
    }
  }

  const label = state === "loading" ? "Generating…" : state === "success" ? "Downloaded!" : null;
  return { state, trigger, label };
}
