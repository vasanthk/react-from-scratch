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

- unmountComponent: To make sure we release all the memory.

Base Class API (MultiChild)

*mountChildren -> updateChildren -> unmountChildren


###References

[React Source parsing](http://zhenhua-lee.github.io/react/react.html)

[React Source Analysis - Part I (first rendering principle)](http://purplebamboo.github.io/2015/09/15/reactjs_source_analyze_part_one/)

[React Source Analysis - Part II (update mechanism principle)](http://purplebamboo.github.io/2015/09/15/reactjs_source_analyze_part_two/)

[React source code analysis series - Decrypting setState](https://zhuanlan.zhihu.com/p/20328570)

[React source code analysis series - Life cycle management](https://zhuanlan.zhihu.com/p/20312691)

[React source code analysis series - React diff](https://zhuanlan.zhihu.com/p/20346379)

[React Source Analysis Series - React Transition](https://zhuanlan.zhihu.com/p/20419592)

[How to implement a Virtual DOM Algorithm](https://github.com/livoras/blog/issues/13)

