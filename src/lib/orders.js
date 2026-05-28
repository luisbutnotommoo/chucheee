import { supabase } from "$lib/supabaseClient";

const db = supabase.schema("orders");

export async function createOrderFromCart(items) {
  const payload = items.map((item) => ({
    product_id: item.product_id,
    price: Number(item.price),
    quantity: item.quantity,
  }));

  const { data, error } = await supabase
    .schema("orders")
    .rpc("create_simple_order", {
      p_items: payload,
    });

  return {
    orderId: data,
    error,
  };
}
