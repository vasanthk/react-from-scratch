class Component {
  constructor(props) {
    // Set up some fields for later use.
    this.props = props;
    this._currentElement = null;
    this._pendingState = null;
    this._renderedComponent = null;
    this._renderedNode = null;

    assert(typeof this.render === 'function');
  }

  setState(partialState) {
    // React uses a queue here to allow batching
    this._pendingState = Object.assign(
      {},
      instance.state,
      partialState
    );
    Reconciler.performUpdateIfNecessary(this);
  }

  // We have a helper method here to avoid having a wrapper instance.
  // React does that - it's a smarter implementation and hides required helpers, internal data.
  // That also allows renderers to have their own implementation of specific wrappers.
  // This ensures that React.Component is available on Native.
  _construct(element) {
    this._currentElement = element;
  }

  mountComponent() {
    // This is where the magic starts to happen.
    // We call the render method to get our actual rendered element.
    // Note: Since React doesn't support Arrays or other types, we can
    // safely assume we have an element.
    let renderedElement = this.render();

    // TODO: call componentWillMpunt

    // Actually instantiate the rendere element
    let component = instantiateComponent(renderedElement);

    this._renderedComponent = component;

    // Generate markup for component & recurse!
    // Since Composite Components instances don't have a DOM representation of their own,
    // this markup will actually be the DOM nodes (or Native views)
    // Note: "Composite component" simply is a component made up of multiple components

    let renderedNode = Reconciler.mountComponent(component, node);

    return renderedNode;
  }

  receiveComponent(nextElement) {
    this.updateComponent(nextElement)
  }

  updateComponent(nextElement) {
    let prevElement = this._currentElement;

    // When just updating state, nextElement will be the same as the previously rendered element.
    // Otherwise, this update is the result of parent re-rendering.
    if (prevElement !== nextElement) {
      // TODO: call componentWillReceiveProps()
    }

    // TODO: call shouldComponentUpdate
    // and return if false
    //
    // TODO: call componentWillUpdate

    // Update instance data
    this._currentElement = nextElement;
    this.props = nextElement.props;
    if (this._pendingState) {
      this.state = this._pendingState;
    }
    this._pendingState = null;

    // We need previously rendered element
    // (render() result) to compare to the next render() result.
    let prevRenderedElement = this._renderedComponent._currentElement;
    let nextRenderedElement = this.render();

    // Just like a top-level update, determine if we should update or replace.
    let shouldUpdate = shouldUpdateComponent(prevRenderedElement, nextRenderedElement);

    if (shouldUpdate) {
      Reconciler.receiveComponent(
        this._renderedComponent,
        nextRenderedElement
      );
    } else {
      // Unmount the current component and instantiate the new one,
      // replace the content in the DOM
      Reconciler.unmountComponent(
        this._renderedComponent
      );
      let nextRenderedComponent = instantiateComponent(nextRenderedElement);
      let nextMarkup = Reconciler.mountComponent(nextRenderedComponent);
      DOM.replaceNode(
        this._renderedComponent._domNode,
        nextMarkup
      );
      this._renderedComponent = nextRenderedComponent;
    }
  }
}