import React from 'react'
import renderer from './index'
import { Text, View, TextInput } from 'react-native'

const Comp = () => (
  <View>
    <Text>
      Welcome to React Native!
    </Text>
    <Text>
      To get started, edit index.ios.js
    </Text>
    <Text>
      Press Cmd+R to reload,{'\n'}
      Cmd+D or shake for dev menu
    </Text>
    <TextInput value='asdf' />
  </View>
)

describe('tagNames', () => {
  it('basic', () => {
    let view = renderer(<Comp />)

    let input = view.query('TextInput')
  })
})

describe('attributes', () => {
  it('attribute existance', () => {
    let view = renderer(<Comp />)

    let input = view.query('[value]')
    expect(input).not.toBeNull()
  })

  it('matches =', () => {
    let view = renderer(<Comp />)

    let input = view.query("[value='asdf']")
    expect(input).not.toBeNull()
  })

  it('matches |= where value is exact', () => {
    let view = renderer(<Comp />)

    let input = view.query("[value|='asdf']")
    expect(input).not.toBeNull()
  })

  it('matches |= where value is followed by -', () => {
    let view = renderer(<Text testID='asdf-fdsa'>Yo</Text>)

    let text = view.query("[testID|='asdf']")
    expect(text).not.toBeNull()
  })

  it('matches ^=', () => {
    let view = renderer(<Comp />)

    let input = view.query("[value^='as']")
    expect(input).not.toBeNull()
  })

  it('matches $=', () => {
    let view = renderer(<Comp />)

    let input = view.query("[value$='df']")
    expect(input).not.toBeNull()
  })

  it('matches *=', () => {
    let view = renderer(<Comp />)

    let input = view.query("[value*='sd']")
    expect(input).not.toBeNull()
  })

  it('can match multiple attributes', () => {
    let view = renderer(<Text a='asdf' b='fdsa'>Yo</Text>)

    let text = view.query("[a$='df'][b*='ds']")
    expect(text).not.toBeNull()
  })

  it('can match with a tagname', () => {
    let view = renderer(<Comp />)
    let input = view.query("TextInput[value='asdf']")
    expect(input).not.toBeNull()
  })
})

describe('id', () => {
  it('will match a testID', () => {
    let view = renderer(<Text testID='test'>Yo</Text>)
    let text = view.query('#test')
    expect(text).not.toBeNull()
  })
})

describe('selectors', () => {
  it('matches multiple views with multiple selectors', () => {
    let view = renderer(
      <View>
        <Text testID='test'>Yo</Text>
        <TextInput />
      </View>
    )

    let views = view.queryAll('#test, TextInput')
    expect(views.length).toEqual(2)
  })
})

describe('simulate', () => {
  it('errors when you try to simulate on something that cant handle that event', () => {
    let onChange = jest.fn()
    let view = renderer(<TextInput onChange={onChange} />)
    expect(() => {
      view.simulate('changeText', 'asdf')
    }).toThrow()
    expect(onChange).not.toHaveBeenCalled()
  })

  it('doesnt error and calls the handler', () => {
    let onChangeText = jest.fn()
    let view = renderer(<TextInput onChangeText={onChangeText} />)
    expect(() => {
      view.simulate('changeText', 'asdf')
    }).not.toThrow()
    expect(onChangeText).toHaveBeenCalledWith('asdf')
  })
})