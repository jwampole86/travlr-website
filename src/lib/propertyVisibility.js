const HIDDEN_PROPERTY_IDS = new Set(["6aa0f8640be251ea460dcf80"]);

export const isPropertyPublic = (property) =>
  property != null && !HIDDEN_PROPERTY_IDS.has(property.id);

export const publicProperties = (properties) =>
  properties.filter(isPropertyPublic);
