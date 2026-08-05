function(instance, properties, context) {
  if (
    !instance.data ||
    typeof instance.data.notify !== "function"
  ) {
    console.warn(
      "Prime Toast Mobile: o componente ainda não está disponível."
    );
    return;
  }

  const message =
    properties.message === null ||
    properties.message === undefined
      ? ""
      : String(properties.message);

  const type =
    properties.type === null ||
    properties.type === undefined
      ? "success"
      : String(properties.type).trim().toLowerCase();

  const position =
    properties.position === null ||
    properties.position === undefined
      ? "top"
      : String(properties.position).trim().toLowerCase();

  const durationValue = Number(properties.duration);

  const duration =
    Number.isFinite(durationValue) &&
    durationValue >= 0
      ? durationValue
      : 4000;

  const customIcon =
    properties.custom_icon === null ||
    properties.custom_icon === undefined
      ? ""
      : String(properties.custom_icon);

  instance.data.notify({
    message: message,
    type: type,
    position: position,
    duration: duration,
    show_icon: properties.show_icon !== false,
    custom_icon: customIcon
  });
}