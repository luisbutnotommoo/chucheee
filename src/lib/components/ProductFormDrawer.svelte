<script>
    import { fade, fly } from "svelte/transition";

    let {
        isOpen = $bindable(),
        form = $bindable(),
        selectedFiles = $bindable(),
        categories,
        editingId,
        saveProduct,
        resetForm,
    } = $props();

    function closeDrawer() {
        isOpen = false;
        setTimeout(() => {
            if (editingId) resetForm();
        }, 300);
    }
</script>

{#if isOpen}
    <div
        class="fixed inset-0 bg-pink-200 z-50 backdrop-blur-sm"
        transition:fade={{ duration: 200 }}
        onclick={closeDrawer}
        role="presentation"
        aria-label="Cerrar formulario"
    ></div>

    <div
        class="fixed right-0 top-0 h-full w-full max-w-lg bg-pink-100 z-50 shadow-2xl border-l border-white/5 flex flex-col"
        transition:fly={{ x: 500, duration: 300 }}
    >
        <div
            class="flex items-center justify-between p-6 border-b border-white/5 bg-[#FFF7FB]"
        >
            <h2
                class="text-xl font-light tracking-tight text-black flex items-center gap-3"
            >
                <span class={editingId ? "text-pink-300" : "text-green-300"}>
                    {editingId ? "🖊️" : "✨"}
                </span>
                {editingId ? "Editar producto" : "Nuevo producto"}
            </h2>
            <button
                onclick={closeDrawer}
                class="text-[#A67790] hover:text-white text-2xl p-1"
            >
                &times;
            </button>
        </div>

        <div class="flex-1 overflow-y-auto p-8">
            <form
                id="productForm"
                onsubmit={(e) => {
                    e.preventDefault();
                    saveProduct();
                }}
                class="space-y-6"
            >
                <div class="space-y-2">
                    <label
                        for="categoryId"
                        class="text-xs uppercase tracking-widest text-[#8A5F76] font-medium"
                        >Categoría *</label
                    >
                    <select
                        id="categoryId"
                        bind:value={form.categoryId}
                        class="w-full rounded-xl bg-[#FFF7FB] border border-white/5 px-4 py-3.5 text-sm focus:border-pink-300/30 focus:ring-1 focus:ring-pink-300/20 transition-all"
                        required
                    >
                        {#each categories as category}
                            <option value={category.category_id}>
                                {category.description}
                            </option>
                        {/each}
                    </select>
                </div>

                <div class="space-y-2">
                    <label
                        for="name"
                        class="text-xs uppercase tracking-widest text-[#8A5F76] font-medium"
                        >Nombre del Producto *</label
                    >
                    <input
                        id="name"
                        bind:value={form.name}
                        placeholder="Ej. Sudadera 'Aurora' Oversize"
                        class="w-full rounded-xl bg-[#FFF7FB] border border-white/5 px-4 py-3.5 text-sm focus:border-pink-300/30 focus:ring-1 focus:ring-pink-300/20 transition-all placeholder:text-white/20"
                        required
                    />
                </div>

                <div class="space-y-2">
                    <label
                        for="description"
                        class="text-xs uppercase tracking-widest text-[#8A5F76] font-medium"
                        >Descripción *</label
                    >
                    <textarea
                        id="description"
                        bind:value={form.description}
                        placeholder="Detalles sobre material, corte, cuidados..."
                        class="w-full rounded-xl bg-[#FFF7FB] border border-white/5 px-4 py-3.5 text-sm focus:border-pink-300/30 focus:ring-1 focus:ring-pink-300/20 transition-all placeholder:text-white/20 min-h-32 resize-none"
                        required
                    ></textarea>
                </div>

                <div class="grid grid-cols-2 gap-5">
                    <div class="space-y-2">
                        <label
                            for="price"
                            class="text-xs uppercase tracking-widest text-[#8A5F76] font-medium"
                            >Precio ($) *</label
                        >
                        <input
                            id="price"
                            bind:value={form.price}
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            class="w-full rounded-xl bg-[#FFF7FB] border border-white/5 px-4 py-3.5 text-sm text-right font-mono focus:border-pink-300/30 focus:ring-1 focus:ring-pink-300/20 transition-all"
                            required
                        />
                    </div>
                    <div class="space-y-2">
                        <label
                            for="stock"
                            class="text-xs uppercase tracking-widest text-[#8A5F76] font-medium"
                            >unidades en Stock *</label
                        >
                        <input
                            id="stock"
                            bind:value={form.stock}
                            type="number"
                            placeholder="0"
                            class="w-full rounded-xl bg-[#FFF7FB] border border-white/5 px-4 py-3.5 text-sm text-right font-mono focus:border-pink-300/30 focus:ring-1 focus:ring-pink-300/20 transition-all"
                            required
                        />
                    </div>
                </div>

                {#if editingId}
                    <div class="space-y-2">
                        <label
                            for="status"
                            class="text-xs uppercase tracking-widest text-[#8A5F76] font-medium"
                            >Estado de Visibilidad</label
                        >
                        <select
                            id="status"
                            bind:value={form.status}
                            class="w-full rounded-xl bg-[#FFF7FB] border border-white/5 px-4 py-3.5 text-sm focus:border-pink-300/30 focus:ring-1 focus:ring-pink-300/20 transition-all"
                        >
                            <option value="active"
                                >Activo (Visible en tienda)</option
                            >
                            <option value="discontinued"
                                >Descontinuado (Oculto)</option
                            >
                        </select>
                    </div>
                {/if}

                <div class="space-y-2 pb-4">
                    <label
                        for="pictures"
                        class="text-xs uppercase tracking-widest text-[#8A5F76] font-medium"
                        >Imágenes del Producto</label
                    >
                    <div class="relative group">
                        <input
                            id="pictures"
                            type="file"
                            accept="image/*"
                            multiple
                            onchange={(e) => {
                                selectedFiles = Array.from(
                                    e.target.files ?? [],
                                );
                            }}
                            class="w-full text-xs text-[#8A5F76] file:mr-4 file:py-3 file:px-5 file:rounded-lg file:border-0 file:text-xs file:uppercase file:tracking-widest file:font-medium file:bg-white/5 file:text-white/80 hover:file:bg-white/10 file:cursor-pointer cursor-pointer rounded-xl bg-[#FFF7FB] border border-white/5 p-1"
                        />
                    </div>

                    {#if selectedFiles.length > 0}
                        <div
                            class="mt-4 rounded-xl border border-pink-300/10 bg-pink-900/10 p-4 flex items-center gap-3"
                        >
                            <span class="text-xl">📸</span>
                            <p class="text-sm text-[#B94F7F] font-medium">
                                {selectedFiles.length} imagen(es) seleccionada(s)
                                lista(s) para subir.
                            </p>
                        </div>
                    {/if}
                </div>
            </form>
        </div>

        <div class="p-6 border-t border-white/5 bg-[#FFF7FB] flex gap-3">
            <button
                type="submit"
                form="productForm"
                class="flex-1 rounded-full bg-[#F9DDEB] px-6 py-4 text-sm uppercase tracking-[0.2em] font-semibold text-black hover:bg-pink-100 transition-colors"
            >
                {editingId ? "Guardar cambios" : "Crear Producto"}
            </button>
            <button
                type="button"
                onclick={closeDrawer}
                class="rounded-full border border-[#E7B8CF] px-6 py-4 text-sm uppercase tracking-[0.2em] text-[#6B4259] hover:bg-[#F3C4DA]/10 transition-colors"
            >
                Cancelar
            </button>
        </div>
    </div>
{/if}
