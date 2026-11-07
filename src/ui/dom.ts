export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

export interface SegmentOption<T extends string> {
  value: T;
  label: string;
  disabled?: boolean;
}

/** A group of radio buttons styled as a segmented control. */
export function segmented<T extends string>(
  legend: string,
  name: string,
  options: SegmentOption<T>[],
  value: T,
  onChange: (value: T) => void,
): HTMLFieldSetElement {
  const fieldset = el('fieldset', 'segmented');
  fieldset.appendChild(el('legend', undefined, legend));
  const row = el('div', 'segments');
  for (const option of options) {
    const label = el('label', 'segment');
    const input = el('input');
    input.type = 'radio';
    input.name = name;
    input.value = option.value;
    input.checked = option.value === value;
    input.disabled = option.disabled ?? false;
    input.addEventListener('change', () => onChange(option.value));
    label.append(input, el('span', undefined, option.label));
    row.appendChild(label);
  }
  fieldset.appendChild(row);
  return fieldset;
}
