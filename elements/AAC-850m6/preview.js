function(instance, properties) {
  const canvas =
    instance.canvas && instance.canvas[0]
      ? instance.canvas[0]
      : instance.canvas;

  if (!canvas) {
    return;
  }

  const background =
    properties.success_bg || "#DAFCE8";

  const textColor =
    properties.success_txt || "#1B5C55";

  const borderColor =
    properties.success_border || "#A4E2BE";

  const borderSize =
    Number(properties.border_size) || 1;

  const borderRadius =
    Number(properties.border_radius) || 12;

  const fontSize =
    Number(properties.font_size) || 15;

  const iconSize =
    Number(properties.icon_size) || 18;

  const iconSpacing =
    Number(properties.icon_spacing) || 8;

  const paddingHorizontal =
    Number(properties.padding_horizontal) || 16;

  const paddingVertical =
    Number(properties.padding_vertical) || 12;

  canvas.innerHTML = "";

  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.display = "flex";
  canvas.style.alignItems = "center";
  canvas.style.justifyContent = "center";
  canvas.style.boxSizing = "border-box";
  canvas.style.overflow = "hidden";

  const toast = document.createElement("div");

  toast.style.display = "flex";
  toast.style.flexDirection = "row";
  toast.style.alignItems = "center";
  toast.style.maxWidth = "90%";
  toast.style.boxSizing = "border-box";

  toast.style.padding =
    paddingVertical +
    "px " +
    paddingHorizontal +
    "px";

  toast.style.background = background;
  toast.style.color = textColor;

  toast.style.border =
    borderSize +
    "px solid " +
    borderColor;

  toast.style.borderRadius =
    borderRadius + "px";

  const icon = document.createElement("span");

  icon.textContent =
    properties.success_icon || "👍";

  icon.style.fontSize = iconSize + "px";
  icon.style.marginRight = iconSpacing + "px";
  icon.style.lineHeight = "1";

  const message = document.createElement("span");

  message.textContent = "Mensagem de sucesso";
  message.style.fontSize = fontSize + "px";
  message.style.lineHeight = "1.3";

  toast.appendChild(icon);
  toast.appendChild(message);
  canvas.appendChild(toast);
}