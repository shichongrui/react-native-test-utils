import React, { Component } from 'react'
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
    expect(text.text()).toEqual('Yo')
  })

  it('ignores periods as classnames', () => {
    let view = renderer(<Text testID='a.b'>Yo</Text>)
    expect(view.query('#a.b')).not.toBeNull()
    console.log(view.query('#a.b'))
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

  it('provides a query API to queried results', () => {
    const view = renderer(
      <View>
        <View testID='block1'>
          <Text>1</Text>
          <Text>2</Text>
          <Text>3</Text>
        </View>
        <View testID='block2'>
          <Text>4</Text>
          <Text>5</Text>
          <Text>6</Text>
        </View>
      </View>
    )
    const block1 = view.query('#block1');
    const textBlocks = block1.queryAll('Text');
    expect(textBlocks.length).toEqual(3)
    expect(textBlocks.map((item) => item.text())).toEqual(expect.arrayMatching(['1', '2', '3']))
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

describe('text', () => {
  it('finds all the text rendered by a component and its subviews', () => {
    let view = renderer(
      <View>
        <Text>H</Text>
        <Text>e</Text>
        <Text>l</Text>
        <Text>l</Text>
        <View>
          <Text>o</Text>
        </View>
      </View>
    )
    expect(view.text()).toEqual('Hello')
  })
})

describe('instance', () => {
  it('will return the underlying react instance', () => {
    let view = renderer(
      <View></View>
    )
    expect(view.instance()).not.toBeNull()
  })
})

describe('state', () => {
  it('returns the components state', () => {
    class Test extends Component {
      state = { test: 'test' }
      render () {
        return (<View></View>)
      }
    }
    let view = renderer(<Test />)
    expect(view.state()).toEqual({ test: 'test' })
  })
})
