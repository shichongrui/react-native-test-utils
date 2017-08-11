import renderer from 'react-test-renderer'
import find from './find'
import { CssSelectorParser } from 'css-selector-parser'

const PARSER = new CssSelectorParser()
PARSER.registerAttrEqualityMods('^', '$', '*', '|')

function eventSimulator(props, eventName, event) {
  return function () {
    props[eventName](event)
  }
}

function createApi (tree) {
  if (!tree) return null
  return {
    props: tree.props,
    instance: tree.instance,

    simulate (eventName, event) {
      let eventHandlerName = `on${eventName[0].toUpperCase()}${eventName.substring(1)}`

      if (!tree.props[eventHandlerName]) {
        throw new Error(`Event ${eventName} not handled`)
      }

      tree.props[eventHandlerName](event)
    },

    text () {
      return find(tree, {
        type: 'custom',
        match: (tree) => {
          let children = Array.isArray(tree.props.children) ? tree.props.children : [tree.props.children]
          return children.some(child => typeof child === 'string')
        }
      }).map(({ props }) => {
        let children = Array.isArray(props.children) ? props.children : [props.children]
        return children
          .filter(child => typeof child === 'string')
          .join('')
      })
      .join('')

    }
  }
}

export default function (component) {
  let view = renderer.create(component)
  return {
    query (selector) {
      selector = selector.replace('.', '\\.')
      let parsed = PARSER.parse(selector)
      return createApi(find(view.toTree(), parsed)[0])
    },
    queryAll (selector) {
      selector = selector.replace('.', '\\.')
      let parsed = PARSER.parse(selector)
      return find(view.toTree(), parsed).map(createApi)
    },
    update: view.update,
    toJSON: view.toJSON,
    ...createApi(view.toTree())
  }
}