export default function (tree, attributes) {
  return attributes.every((attribute) => {
    let prop = tree.props[attribute.name]
    switch (attribute.operator) {
      case undefined:
        return !!prop
      case '=':
        return prop === attribute.value
      case '|=':
        return prop && (prop === attribute.value || prop.match(new RegExp(`^${attribute.value}-`)))
      case '^=':
        return prop && prop.match(new RegExp(`^${attribute.value}`))
      case '$=':
        return prop && prop.match(new RegExp(`${attribute.value}$`))
      case '*=':
        return prop && prop.match(new RegExp(attribute.value))
      default:
        return false
    }
  })
}