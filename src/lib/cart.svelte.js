import { browser } from "$app/environment";

let initialItems = [];

if (browser) {
  const saved = localStorage.getItem("cart");

  if (saved) {
    initialItems = JSON.parse(saved);
  }
}

export const cart = $state({
  items: initialItems,
  isOpen: false,
});

function syncCart() {
  if (browser) {
    localStorage.setItem("cart", JSON.stringify(cart.items));
  }
}

export function openCart() {
  cart.isOpen = true;
}

export function closeCart() {
  cart.isOpen = false;
}

export function addToCart(product) {
  const existing = cart.items.find(
    (item) => item.product_id === product.product_id,
  );

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.items.push({
      ...product,
      quantity: 1,
    });
  }

  cart.isOpen = true;
  syncCart();
}

export function removeFromCart(productId) {
  cart.items = cart.items.filter((item) => item.product_id !== productId);
  syncCart();
}

export function updateQuantity(productId, delta) {
  const item = cart.items.find((item) => item.product_id === productId);

  if (!item) return;

  item.quantity += delta;

  if (item.quantity <= 0) {
    removeFromCart(productId);
    return;
  }

  syncCart();
}

export function clearCart() {
  cart.items = [];
  syncCart();
}

export function getCartTotal() {
  return cart.items.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0,
  );
}

export function getCartCount() {
  return cart.items.reduce((total, item) => total + item.quantity, 0);
}
