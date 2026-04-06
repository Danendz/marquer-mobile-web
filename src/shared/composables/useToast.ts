import { toastController } from '@ionic/vue';

async function showToast(message: string, color = 'dark', duration = 2000) {
  const toast = await toastController.create({ message, color, duration, position: 'bottom' });
  await toast.present();
}

export function useToast() {
  return {
    success: (msg: string) => showToast(msg, 'success'),
    error: (msg: string) => showToast(msg, 'danger'),
    warning: (msg: string) => showToast(msg, 'warning'),
    info: (msg: string) => showToast(msg, 'dark'),
  };
}
