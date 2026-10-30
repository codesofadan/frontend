const CID_KEY = 'hudamoji-cid';

// Random id for this browser, so a cart can be remembered before the shopper types a phone number.
export function getCid() {
  try {
    let id = localStorage.getItem(CID_KEY);
    if (!id) {
      id = crypto.randomUUID?.() ?? [Date.now(), Math.random(), Math.random()].map((n) => n.toString(36).replace('.', '')).join('');
      localStorage.setItem(CID_KEY, id);
    }
    return id;
  } catch {
    return '';
  }
}
