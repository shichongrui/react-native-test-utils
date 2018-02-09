# react-native-test-utils

Testing in react native can be difficult besides just matching to snapshot. This library tries to make testing easier.

## Example

    import renderer from 'react-native-test-utils'
    import MyComponent from './MyComponent'

    test('it has the correct text', () => {
      let view = renderer(<MyComponent />)

      let textView = view.query('Text')
      expect(textView.text()).toEqual('Hello')
    })

    test('it updates the name based on the text input', () => {
      let view = renderer(<MyComponent />)

      let textInputView = view.query("TextInput[placeholder='Name']")
      textInputView.simulate('changeText', 'react-native-test-utils')

      let textViews = view.queryAll("Text")
      expect(textViews.map(t => t.text())).toContain('react-native-test-utils')
    })

`react-native-test-utils` uses css selectors to find rendered components in your react tree and then allows you to simulate user interactions as well as assert on rendered output of those views. It uses `react-test-renderer` under the hood so it does not need to shallow render.

## API

### `renderer`

This is the default export of react-native-test-utils. You pass in JSX as the parameter. It returns a component api with the signature of

    {
      query,
      queryAll,
      update,
      toJSON,
      simulate,
      text,
      props,
      instance,
      component,
      state
    }

The `query`, `queryAll`, `toJSON`, and `update` methods are only available on the root view component that gets returned from `renderer`. They are not available on sub views in the react tree.

### `query(string): ComponentApi`
Similar to `querySelector` in a browser. Pass in a string that is a css selector. It will return the first view in the tree that matches that selector. The returns a component api that matches the return value of `renderer` except that it does not include methods only available on the top level component.

### `queryAll(string): Array<ComponentApi>`
Similar to `querySelectorAll` in a browser. Pass in a string that is a css selector. It will return an array of all the views that match the selector. Each item in the array is a component api that matches the return value of `renderer` except that it does not includeonly available on the top level component.

`query` and `queryAll` currently only support a subset of css selectors. Currently it supports:
 - Tag name `'TextInput'`
 - Attributes(Props) `"[placeholder='some text']"`
 - Id(testID) `'#my-component.text-input'`

 These can also be used together such as `"TextInput[placeholder='some text']"` and it also supports compound selectors `'Text, View'`

### `update(ReactElement/JSX): void`
This method allows you to trigger another render into the same rendering context. Pass in JSX just as you would with `renderer`. This method is useful for cases where you want to test different render trees that may need to make changes to state in a react life cycle method such as `componentWillReceiveProps`. It does not return anything. After calling this method any previous components retrieved using `query` or `queryAll` will no longer be up to date and you will need to get those components again.

### `toJSON(): any`
Returns an object representation of the entire tree. Useful for matching to a snapshot.

The remaining methods and properties are on every component api returned from calls to `query` and `queryAll`

### `simulate(string, any): void`
If a component responds to any kind of event that takes a handler as a `on*` property such as `onChange` or `onPress`, you can use `simulate` to trigger that event. The first parameter is the event you would like to trigger and the second parameter is the value you passed into the event handler. eg. `view.simulate('press', {})` After calling `simulate` if the rendered output changes, any component retrieved using `query` and `queryAll` may be out of date and it will be necessary to fetch them again.

### `text(): string`
Will return all of the rendered text that component or any of it's subviews render as children.

### `props: any`
The props passed to that component.

### `instance(): any`
The underlying instance of the component that got rendered.

### `component`
The component rendered from react-test-renderer

### `state(): any`
Retreives the state of the current instance of the component.
