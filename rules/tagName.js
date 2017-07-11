export default function (component, tagName) {
  if (component.type.name === 'Component') {
    component = component.rendered
  }
  return component.type === tagName || component.type.name === tagName
}