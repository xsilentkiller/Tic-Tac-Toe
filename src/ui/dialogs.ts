import { el } from './dom';

/** Modal yes/no question using the native <dialog> element. Resolves true on confirm. */
export function confirmDialog(message: string, confirmLabel = 'Continue'): Promise<boolean> {
  return new Promise((resolve) => {
    const dialog = el('dialog', 'dialog');
    const text = el('p', undefined, message);
    const buttons = el('div', 'controls');
    const cancel = el('button', undefined, 'Cancel');
    const confirm = el('button', 'primary', confirmLabel);
    cancel.type = confirm.type = 'button';
    buttons.append(cancel, confirm);
    dialog.append(text, buttons);

    // Closing by any route (Escape, buttons) ends here; returnValue says which.
    dialog.addEventListener('close', () => {
      resolve(dialog.returnValue === 'confirm');
      dialog.remove();
    });
    cancel.addEventListener('click', () => dialog.close('cancel'));
    confirm.addEventListener('click', () => dialog.close('confirm'));

    document.body.appendChild(dialog);
    dialog.showModal();
  });
}
