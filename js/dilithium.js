function createElement(type, config, children) {
  // type -- class itself or a string
  // config -- kinda like props

  // Clone the passed in config (props). In React we move some special props off of this object (keys, refs).
  let props = Object.assign({}, config);

  // Build props.children. We'll make it an array if we have more than 1.
  let childCount = arguments.length - 2;
  if (childCount === 1) {
    props.children = children;
  } else if (childCount > 1) {
    props.children = [].slice.call(arguments, 2);
  }

  return {
    type,
    props
  };
}

/** DOM Renderer **/

// Bookkeeping bits. We need to store some data and ensure no roots conflict.
const ROOT_KEY = 'dlthmRootId';
const instancesByRootID = {};
let rootId = 1;

function isRoot(node) {
  return node.dataset[ROOT_KEY];
}

function render(element, node) {
  assert(Element.isValidElement(element));

  // First check if w've already rendered into this node.
  // If so, this is an update.
  // Otherwise this is an initial render.
  if (isRoot(node)) {
    update(element, node);
  } else {
    mount(element, node);
  }
}

// Initial creation, instantiation and rendering of instances
function mount(element, node) {
  // Create the internal instance. This abstracts away the different components types.
  let component = instantiateComponent(element);

  // Store this for later updates & unmounting.
  instanceByRootId[rootId] = component;

  // Mounting generates DOM nodes. This is where React determines
  // if we're re-mounting server side rendered content.
  let renderedNode = Reconciler.mountComponent(component, node);

  // Do some DOM operations, marking this node as a root,
  // and inserting the new DOM as a child.
  node.dateset[ROOT_KEY] = rootID;
  DOM.empty(node);
  DOM.appendChild(node, renderedNode);
  rootID++;
}

function update(element, node) {
  // Find the internal instance and update it.
  let id = node.dataset[ROOT_KEY];
  let instance = instancesByRootID[id];

  let prevElem = instance._currentElement;
  if (shouldUpdateComponent(prevElem, element)) {
    // Send the new element to the instance.
    Reconciler.receiveComponent(
      instance,
      element
    );
  } else {
    // If it is a new component and not allowed to update
    // Unmount the current one and mount the new one.
    unmountComponentAtNode(node);
    mount(element, node);
  }
}

// This determines if we're going to end up reusing the internal instance or not.
// This is one of the big shortcuts that React does, stopping us from instantiating and comparing full trees.
// Instead we immediately throw away a subtree when updating from element type to another.
function shouldUpdateComponent(prevElement, nextElement) {
  // Simply use element.type
  // 'div' !== 'span'
  // ColorSwatch !== CounterButton
  // Note: in React we would also look at the key.
  return prevElement.type === nextElement.type;
}
