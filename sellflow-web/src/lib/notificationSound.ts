import { Howl, Howler } from "howler";
import type { NotificationType } from "../Services/notifications";

export const NOTIFICATION_SOUND_PREFERENCE_KEY = "sellflow.notifications.sound";
export const NOTIFICATION_SOUND_PREFERENCE_EVENT = "sellflow:notification-sound-preference";

type Waveform = "sine" | "triangle";

interface SoundProfile {
  frequencies: number[];
  waveform: Waveform;
  volume: number;
}

const soundProfiles: Record<NotificationType, SoundProfile> = {
  order: {
    frequencies: [880, 1174.66],
    waveform: "sine",
    volume: 0.55,
  },
  inventory: {
    frequencies: [440, 349.23],
    waveform: "triangle",
    volume: 0.48,
  },
  system: {
    frequencies: [659.25, 880],
    waveform: "sine",
    volume: 0.42,
  },
};

const sounds = new Map<NotificationType, Howl>();

export function isNotificationSoundEnabled(): boolean {
  return localStorage.getItem(NOTIFICATION_SOUND_PREFERENCE_KEY) !== "false";
}

export function setNotificationSoundEnabled(enabled: boolean): void {
  localStorage.setItem(NOTIFICATION_SOUND_PREFERENCE_KEY, String(enabled));
  if (!enabled) Howler.stop();
  window.dispatchEvent(new CustomEvent<boolean>(NOTIFICATION_SOUND_PREFERENCE_EVENT, {
    detail: enabled,
  }));
}

export async function initializeNotificationSound(): Promise<void> {
  if (!isNotificationSoundEnabled()) return;

  Howler.autoUnlock = true;
  (["order", "inventory", "system"] as NotificationType[]).forEach(getSound);
  if (Howler.ctx?.state === "suspended") {
    await Howler.ctx.resume().catch(() => undefined);
  }
}

export async function playNotificationSound(type: NotificationType = "system"): Promise<void> {
  if (!isNotificationSoundEnabled()) return;

  await initializeNotificationSound();
  if (Howler.ctx?.state === "suspended") return;

  getSound(type).play();
}

function getSound(type: NotificationType): Howl {
  const existing = sounds.get(type);
  if (existing) return existing;

  const profile = soundProfiles[type];
  const customSource = customSoundSource(type);
  const sound = new Howl({
    src: [customSource || createChimeDataUri(profile)],
    ...(customSource ? {} : { format: ["wav"] }),
    preload: true,
    html5: false,
    volume: profile.volume,
  });

  sounds.set(type, sound);
  return sound;
}

function customSoundSource(type: NotificationType): string | undefined {
  const sources: Record<NotificationType, string | undefined> = {
    order: import.meta.env.VITE_NOTIFICATION_ORDER_SOUND_URL,
    inventory: import.meta.env.VITE_NOTIFICATION_INVENTORY_SOUND_URL,
    system: import.meta.env.VITE_NOTIFICATION_SYSTEM_SOUND_URL,
  };

  return sources[type]?.trim() || undefined;
}

function createChimeDataUri(profile: SoundProfile): string {
  const sampleRate = 22050;
  const noteDuration = 0.22;
  const noteGap = 0.035;
  const totalDuration = profile.frequencies.length * noteDuration
    + Math.max(0, profile.frequencies.length - 1) * noteGap;
  const sampleCount = Math.ceil(sampleRate * totalDuration);
  const buffer = new ArrayBuffer(44 + sampleCount * 2);
  const view = new DataView(buffer);

  writeAscii(view, 0, "RIFF");
  view.setUint32(4, 36 + sampleCount * 2, true);
  writeAscii(view, 8, "WAVE");
  writeAscii(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeAscii(view, 36, "data");
  view.setUint32(40, sampleCount * 2, true);

  for (let sampleIndex = 0; sampleIndex < sampleCount; sampleIndex += 1) {
    const time = sampleIndex / sampleRate;
    const noteWindow = noteDuration + noteGap;
    const noteIndex = Math.floor(time / noteWindow);
    const noteTime = time - noteIndex * noteWindow;
    let sample = 0;

    if (noteIndex < profile.frequencies.length && noteTime <= noteDuration) {
      const frequency = profile.frequencies[noteIndex];
      const attack = Math.min(1, noteTime / 0.018);
      const release = Math.min(1, (noteDuration - noteTime) / 0.085);
      const envelope = Math.max(0, attack * release);
      const phase = 2 * Math.PI * frequency * noteTime;
      const wave = profile.waveform === "triangle"
        ? (2 / Math.PI) * Math.asin(Math.sin(phase))
        : Math.sin(phase);
      sample = wave * envelope * 0.62;
    }

    view.setInt16(44 + sampleIndex * 2, Math.round(sample * 32767), true);
  }

  return `data:audio/wav;base64,${arrayBufferToBase64(buffer)}`;
}

function writeAscii(view: DataView, offset: number, value: string): void {
  for (let index = 0; index < value.length; index += 1) {
    view.setUint8(offset + index, value.charCodeAt(index));
  }
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  const chunks: string[] = [];
  const chunkSize = 0x8000;

  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    chunks.push(String.fromCharCode(...bytes.subarray(offset, offset + chunkSize)));
  }

  return btoa(chunks.join(""));
}
