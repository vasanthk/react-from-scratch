class DOMComponentWrapper extends MultiChild {
  constructor(element) {
    super();
    this._currentElement = element;
    this._domeNode = null;
  }

  mountComponent() {
    // Create the DOM element, set attributes,
    // Recurse the children
    let el = document.createElement(
      this._currentElement.type
    );
    this._domNode = el;
    this._updateDOMProperties(
      {},
      this._currentElement.props
    );
    this._createInitialDOMChildren(
      this._currentElement.props
    );

    return el;
  }

  unmountComponent() {
    // React needs to do some special handling for some node types,
    // especially removing event handlers that had to be attached to this node and couldn't
    // be handled through propagation.
    this.unmountChildren();
  }

  receiveComponent(nextElement) {
    this.updateComponent(this._currentElement, nextElement);
  }

  updateComponent(prevElement, nextElement) {
    this._currentElement = nextElement;
    this._updateDOMProperties(prevElement.props, nextElement.props);
    this._updateDOMChildren(prevElement.props, nextElement.props);
  }

  _createInitialDOMChildren(props) {
    let childType = typeof props.children;

    // We'll take a shortcut for text content
    if (
      childType === 'string' ||
      childType === 'number'
    ) {
      this._domNode.textContent = props.children;
    }
    else if (props.children) {
      let mountImages = this.mountChildren(props.children);

      DOM.appendChildren(
        this._domNode,
        mountImages
      );
    }
  }

  _updateDOMChildren(prevProps, nextProps) {
    // React does a bunch of work to handle dangerouslySetInnerHTML
    // React also handles switching between text children and more DOM nodes.

    // TODO: Add code here
  }
}