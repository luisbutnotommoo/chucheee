import { supabase } from "$lib/supabaseClient";

const db = supabase.schema("products");

export async function getCategories() {
  const { data, error } = await db
    .from("categories")
    .select("*")
    .order("description");

  return {
    categories: data ?? [],
    error,
  };
}

export async function getProducts() {
  const { data, error } = await db
    .from("products")
    .select(
      `
      *,
      categories (
        category_id,
        description
      ),
      product_pictures (
        picture_id,
        picture_url
      )
    `,
    )
    .order("name");

  return {
    products: data ?? [],
    error,
  };
}

export async function addProduct(product) {
  let pictureUrls = [];

  if (product.pictureFiles && product.pictureFiles.length > 0) {
    const uploadResult = await uploadPictures(product.pictureFiles);

    if (uploadResult.error) {
      return {
        productId: null,
        error: uploadResult.error,
      };
    }

    pictureUrls = uploadResult.urls;
  }

  console.log("URLS QUE VAN A LA DB:", pictureUrls);
  const { data, error } = await db.rpc("add_product", {
    p_category_id: product.categoryId,
    p_name: product.name,
    p_description: product.description,
    p_price: Number(product.price),
    p_stock: Number(product.stock),
    p_picture_urls: pictureUrls,
  });
  console.log("RPC DATA:", data);
  console.log("RPC ERROR:", error);

  return {
    productId: data,
    error,
  };
}

export async function updateProduct(productId, product) {
  let pictureUrls = null;

  if (product.pictureFiles && product.pictureFiles.length > 0) {
    const uploadResult = await uploadPictures(product.pictureFiles);

    if (uploadResult.error) {
      return {
        data: null,
        error: uploadResult.error,
      };
    }

    pictureUrls = uploadResult.urls;
  }

  console.log("URLS PARA UPDATE:", pictureUrls);

  const { data, error } = await db.rpc("update_product", {
    p_product_id: productId,
    p_category_id: product.categoryId,
    p_name: product.name,
    p_description: product.description,
    p_price: Number(product.price),
    p_stock: Number(product.stock),
    p_status: product.status,
    p_picture_urls: pictureUrls,
  });

  console.log("UPDATE ERROR:", error);

  return {
    data,
    error,
  };
}
async function uploadPictures(files) {
  const uploadedUrls = [];

  for (const file of files) {
    console.log("FILE ORIGINAL:", file.name, file.type, file.size);

    const finalFile = await compressImage(file);

    console.log("FILE FINAL:", finalFile.name, finalFile.type, finalFile.size);

    const path = `products/${crypto.randomUUID()}.webp`;

    const { data, error } = await supabase.storage
      .from("product_pictures")
      .upload(path, finalFile, {
        contentType: "image/webp",
        cacheControl: "3600",
        upsert: false,
      });

    console.log("UPLOAD DATA:", data);
    console.log("UPLOAD ERROR:", error);

    if (error) {
      return {
        urls: [],
        error,
      };
    }

    const { data: publicUrlData } = supabase.storage
      .from("product_pictures")
      .getPublicUrl(data.path);

    console.log("PUBLIC URL:", publicUrlData.publicUrl);

    uploadedUrls.push(publicUrlData.publicUrl);
  }

  return {
    urls: uploadedUrls,
    error: null,
  };
}

async function compressImage(file) {
  const bitmap = await createImageBitmap(file);

  const maxWidth = 1000;
  let width = bitmap.width;
  let height = bitmap.height;

  if (width > maxWidth) {
    const ratio = maxWidth / width;
    width = maxWidth;
    height = Math.round(height * ratio);
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  let quality = 0.75;
  let blob = null;

  while (quality >= 0.35) {
    blob = await new Promise((resolve) => {
      canvas.toBlob(resolve, "image/webp", quality);
    });

    if (blob && blob.size <= 750 * 1024) {
      break;
    }

    quality -= 0.1;
  }

  if (!blob) {
    throw new Error("No se pudo comprimir la imagen.");
  }

  if (blob.size > 750 * 1024) {
    throw new Error(
      "La imagen sigue pesando más de 750 KB después de comprimir.",
    );
  }

  const cleanName = file.name
    .replace(/\.\w+$/, "")
    .replace(/\s+/g, "_")
    .replace(/[^\w.-]/g, "");

  return new File([blob], `${cleanName}.webp`, {
    type: "image/webp",
  });
}
