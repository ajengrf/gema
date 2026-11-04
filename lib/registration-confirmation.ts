"use client";

import { useSyncExternalStore } from "react";

const storageKey = "gema.registration-confirmation";

export type RegistrationConfirmation = {
  fullName: string;
  registrationId: string;
  type: "student" | "teacher";
};

export function saveRegistrationConfirmation(
  confirmation: RegistrationConfirmation,
) {
  try {
    window.sessionStorage.setItem(storageKey, JSON.stringify(confirmation));
  } catch {
    return;
  }
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getSnapshot() {
  return window.sessionStorage.getItem(storageKey);
}

function getServerSnapshot() {
  return null;
}

export function useRegistrationConfirmation() {
  const storedValue = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  if (!storedValue) return null;

  try {
    const value = JSON.parse(storedValue) as RegistrationConfirmation;
    if (
      !value.fullName ||
      !value.registrationId ||
      (value.type !== "student" && value.type !== "teacher")
    ) {
      return null;
    }
    return value;
  } catch {
    return null;
  }
}
