<script>
    import { goto } from "$app/navigation";
    import { createOrderFromCart } from "$lib/orders.js";
    import {
        cart,
        closeCart,
        removeFromCart,
        updateQuantity,
        getCartTotal,
        clearCart,
    } from "$lib/cart.svelte.js";

    let orderError = $state("");
    let placingOrder = $state(false);

    async function handleCreateOrder() {
        orderError = "";

        if (cart.items.length === 0) {
            orderError = "Tu carrito está vacío.";
            return;
        }

        placingOrder = true;

        const result = await createOrderFromCart(cart.items);

        placingOrder = false;

        if (result.error) {
            orderError = result.error.message;
            return;
        }

        clearCart();
        closeCart();
        goto("/confirmacion");
    }
</script>

{#if cart.isOpen}
    <div class="fixed inset-0 z-50">
        <button
            aria-label="Cerrar carrito"
            onclick={closeCart}
            class="absolute inset-0 bg-black/70 backdrop-blur-sm"
        ></button>

        <aside
            class="absolute right-0 top-0 h-full w-full max-w-md bg-[#FFF7FB] text-[#4A3140] border-l border-[#E7B8CF] p-6 shadow-2xl overflow-y-auto"
        >
            <div class="flex items-center justify-between">
                <div>
                    <p
                        class="text-xs uppercase tracking-[0.35em] text-[#C76592]"
                    >
                        Tu compra
                    </p>

                    <h2
                        class="mt-2 text-3xl font-thin uppercase tracking-widest"
                    >
                        Carrito
                    </h2>
                </div>

                <button
                    onclick={closeCart}
                    class="rounded-full border border-[#E7B8CF] px-4 py-2 text-sm text-[#7A5068] hover:bg-[#F3C4DA]/10"
                >
                    Cerrar
                </button>
            </div>

            {#if cart.items.length === 0}
                <p class="mt-10 text-[#8A5F76]">Tu carrito está vacío.</p>
            {:else}
                <div class="mt-8 space-y-4">
                    {#each cart.items as item}
                        <div
                            class="rounded-2xl border border-[#E7B8CF] bg-white/70 p-4"
                        >
                            <div class="flex gap-4">
                                <img
                                    src={item.product_pictures?.[0]
                                        ?.picture_url ??
                                        "https://picsum.photos/seed/cart/200/300"}
                                    alt={item.name}
                                    class="h-24 w-20 rounded-xl object-cover"
                                />

                                <div class="flex-1">
                                    <h3 class="font-medium">{item.name}</h3>

                                    <p class="text-sm text-[#8A5F76]">
                                        ${Number(item.price).toFixed(2)}
                                    </p>

                                    <div class="mt-4 flex items-center gap-3">
                                        <button
                                            onclick={() =>
                                                updateQuantity(
                                                    item.product_id,
                                                    -1,
                                                )}
                                            class="h-8 w-8 rounded-full border border-[#E7B8CF] hover:bg-[#F3C4DA]/10"
                                        >
                                            -
                                        </button>

                                        <span>{item.quantity}</span>

                                        <button
                                            onclick={() =>
                                                updateQuantity(
                                                    item.product_id,
                                                    1,
                                                )}
                                            class="h-8 w-8 rounded-full border border-[#E7B8CF] hover:bg-[#F3C4DA]/10"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                <button
                                    onclick={() =>
                                        removeFromCart(item.product_id)}
                                    class="text-sm text-[#B94F7F] hover:text-white"
                                >
                                    Quitar
                                </button>
                            </div>
                        </div>
                    {/each}
                </div>

                <div class="mt-8 border-t border-[#E7B8CF] pt-6">
                    <div class="flex items-center justify-between text-lg">
                        <span>Total</span>
                        <strong>${getCartTotal().toFixed(2)}</strong>
                    </div>

                    {#if orderError}
                        <p class="mt-4 text-sm text-red-300">{orderError}</p>
                    {/if}

                    <button
                        onclick={handleCreateOrder}
                        disabled={placingOrder}
                        class="mt-6 w-full rounded-full bg-[#F9DDEB] px-6 py-4 text-sm uppercase tracking-[0.25em] text-black disabled:opacity-50"
                    >
                        {placingOrder ? "Creando pedido..." : "Hacer pedido"}
                    </button>
                </div>
            {/if}
        </aside>
    </div>
{/if}
