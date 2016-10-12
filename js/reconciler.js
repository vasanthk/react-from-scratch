// Most of these fucntions check for shortcuts and return or defer it to call the component's function
// This is to make the reconciler generic and cross platform (Web and Native)

function mountComponent(component) {
  // This will generate the DOM node that will go into the DOM.
  // We defer to the component instance since it will contain the renderer
  // specific implementation of what that means.
  // We have abstracted this out here to the reconciler
  // to allows it to be reused across DOM & native (corss platform).
  let markup = component.mountComponent();

  // React does more work here to ensure that the refs work. We don't need to.
  return markup;
}

function receiveComponent(component, element) {
  // Shortcut! We don't do anything if the next element is the same as the current one.
  // This is unlikely in normal JSX usage, but it is an optimization that can be unlocked with
  // Babel's inline-element transform.
  let prevElement = component._currentElement;
  if (prevElement === element) {
    return;
  }

  // Defere to the instance
  component.receiveComponent(element);
}

function unmountComponent(component) {
  // Again, React will do more work here for refs.
  component.unmountComponent();
}

function performUpdateIfNecessary(component) {
  component.performUpdateIfNecessary();
}