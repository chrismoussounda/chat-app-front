import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import { createCanvas, Canvas } from 'canvas';
import { Any } from '@/types';

GlobalWorkerOptions.workerSrc = '/node_modules/pdfjs-dist/build/pdf.worker.js';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getSessionData = (key: string) => {
  const data = sessionStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};

export const setSessionData = (key: string, data: Any) => {
  if (data) {
    const isToken = key === 'token';
    const value = JSON.stringify(isToken ? 'Bearer ' + data : data);
    sessionStorage.setItem(key, value);
  }
};

export const removeSessionData = (key: string) => {
  sessionStorage.removeItem(key);
};

export const getStorageRef = (url: string) => {
  return decodeURIComponent(url.split('/o/')[1].split('?alt=media')[0]);
};

export const processPdf = async (file?: File) => {
  if (!file || !file.type.includes('pdf')) throw new Error('Invalid image');
  const pdf = await getDocument(URL.createObjectURL(file)).promise;
  const page = await pdf.getPage(1); // get first page
  const viewport = page.getViewport({
    scale: 1.0,
  });
  const canvas: Canvas = createCanvas(viewport.width, viewport.height);
  const context = canvas.getContext('2d') as Any;
  await page.render({
    viewport,
    canvasContext: context,
  }).promise;
  const base64String = canvas.toDataURL();
  const split = base64String.split(',');
  const contentType = split[0].split(':')[1].split(';')[0];
  const raw = atob(split[1]);
  const rawLength = raw.length;
  const array = new Uint8Array(new ArrayBuffer(rawLength));

  for (let i = 0; i < rawLength; i++) {
    array[i] = raw.charCodeAt(i);
  }

  // Create a blob and test it
  const blob = new Blob([array], { type: contentType });
  const imageFile = new File([blob], file.name, { type: contentType });
  return { imageFile, pages: pdf.numPages };
};

export const isUUID = (uuid: string) => {
  const regex =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-(8|9|a|b|A|B)[0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
  return regex.test(uuid);
};
