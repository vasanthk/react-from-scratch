# React from scratch!

My attempt at understanding the internals of React and its intricacies.

Notes from talk - [Building React from Scratch - Paul O Shannessy](https://www.youtube.com/watch?v=_MAD4Oly9yg)

**Terminology**

- Component Class

- Component Instance

- Element

**APIs**

Let's call this library `Dilithium`.

Top level API

- `Dilithium.createElement`

- `Dilithium.Component`

- `Dilithium.render`

Component Class API

- `constructor()`

- `render()`

- `setState()`

- `this.props`

- `this.state`

Internal Component Lifecycle

*constructor -> mountComponent -> receiveComponent -> updateComponent -> unmountComponent*

- constructor: Instantiate our component

- mountComponent: Generates the DOM nodes or React native views. Doesn;t necessarily do anything with them. Just returns them out.

- receiveComponent: We can also recieve updates. These are the partial update that we recieve from the renders that happen above this component. eg. Parent component renders and passes new props.

- updateComponent: Mostly an internal API. Even the reconciler itself doesn't really call it.

- unmountComponent: To make sure we release all the memeory.


