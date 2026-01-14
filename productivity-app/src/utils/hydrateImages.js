import { getImage } from "./imageDB";

export async function hydrateImages(container) {
  if (!container) return;

  const imgs = container.querySelectorAll("img[data-img-id]");

  for (const img of imgs) {
    if (img.dataset.hydrated) continue;

    const blobUrl = await getImage(img.dataset.imgId);
    if (blobUrl) {
      img.src = blobUrl;
      img.dataset.hydrated = "true";
    }
  }
}
