import ruleSet from './rules/ruleSet'

export default function find (component, selector) {
  let results = []
  switch (selector.type) {
    case 'ruleSet':
      if (ruleSet(component, selector)) {
        results.push(component)
      }

      if (component.type.name === 'Component') {
        component = component.rendered
      }

      if (component.rendered) {
        let rendered = Array.isArray(component.rendered) ? component.rendered : [component.rendered]
        rendered.forEach(child => {
          if (typeof child === 'object') {
            results = [...results, ...find(child, selector)]
          }
        })
      }
      break
    case 'selectors':
      let selectorsResult = new Set(selector.selectors.map(s => find(component, s)))
      results.push(...selectorsResult)
      break
    case 'custom':
      if (selector.match(component)) {
        results.push(component)
      }
  }

  return results
}