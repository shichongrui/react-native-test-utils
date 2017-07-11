import tagName from './tagName'
import attrs from './attrs'
import id from './id'

let ruleFunctions = {
  tagName,
  attrs,
  id
}

export default function (tree, ruleSet) {
  return Object.keys(ruleSet.rule).every((key => {
    if (key === 'type') return true
    return ruleFunctions[key](tree, ruleSet.rule[key])
  }))
}