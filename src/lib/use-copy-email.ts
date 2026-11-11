"use client";

import { useCallback } from "react";
import { site } from "./site";
import { useToast } from "@/components/toast/ToastProvider";

/** 이메일 주소를 클립보드에 복사하고 토스트를 띄운다 (기획서 C-01 #4, P-01 #6, C-02 #2) */
export function useCopyEmail(messages: { copied: string; copyFailed: string }) {
  const { show } = useToast();
  return useCallback(async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      show(messages.copied);
    } catch {
      show(messages.copyFailed);
    }
  }, [show, messages.copied, messages.copyFailed]);
}
