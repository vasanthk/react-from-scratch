const UPDATE_TYPES = {
  INSERT: 1,
  MOVE: 2,
  REMOVE: 3
};

const OPERATIONS = {
  insert(component, node, afterNode) {
    return {
      type: UPDATE_TYPES.INSERT,
      content: node,
      toIndex: component._mountIndex,
      afterNode: afterNode
    }
  },

  move(component, afterNode, toIndex) {
    return {
      type: UPDATE_TYPES.MOVE,
      fromIndex: component._mountIndex, content: node,
      toIndex: toIndex,
      afterNode: afterNode
    }
  },

  remove(component, node) {
    return {
      type: UPDATE_TYPES.REMOVE,
      fromIndex: component._mountIndex,
      fromNode: node
    }
  }
};

function mountChildren(children) {
  // Instantiate all of the actual child instances into a flat object.
  // This handles all of the logic around flattening subarrays.
  let renderedChildren = ChildReconciler.instantiateChildren(children);
  this._renderedChildren = renderedChildren;

  /*
   {
   '.0.0': {_currentElement, ...},
   '.0.1': {_currentElement, ...}
   }
   */

  // We'll iterate over the renderedChildren object, mounting as we go, which will recurse if needed.
  // Either way, the result is an array of DOM nodes.
  let mountImages = Object.keys(renderedChildren).map(
    (childKey, i) => {
      let child = renderedChildren[childKey];

      // _mountIndex is important - When we do updates we need to track moves and
      // what we store in each of these instances is this index/current position.
      child._mountIndex = i;

      return Reconciler.mountComponent(child);
    }
  );

  // Return and bubble up our DOM nodes
  return mountImages;
}

function unmountChildren() {
  let children = this._renderedChildren;
  Object.keys(childrend)
    .forEach((childKey) => {
      Reconciler.unmountComponent(
        children[childKey]
      );
    })
}

// The following is the bread & butter of React.
// We'll compare the currently rendered children to the next set.
// We need to determine which instances are being moved around,
// which are getting removed, and which are being inserted.
// The ChildReconciler will do the initial work.
// Note: nextChildren is elements
function updateChildren(nextChildren) {
  let prevRenderedChildren = this._renderedChildren;

  // This works just like instantiateChildren - but with elements
  let nextRenderedChildren = flattenChildren(nextChildren);
  /*
   {
   '.0.0': {type, ...},
   '.0.1': {type, ...}
   }
   */

  let mountImages = [];
  let removedNodes = {};
  ChildReconciler.updateChildren(
    prevRenderedChildren,
    nextRenderedChildren,
    mountImages,
    removedNodes
  );

  // prevRenderedChildren is left alone - but if a replace is detected,
  // we unmount the instance, store that instance's node in removedNodes.
  // nextRenderedChildren is mutated. It starts with elements but will be filled
  // with instances after this call. These might be the previous instance if an update is detected,
  // or a new one. Nodes for new instances are stored in removedNodes.
  let lastIndex = 0;
  let nextMountIndex = 0;
  let lastPlacedNode = null;

  // Store a series of update operations here.
  let updates = [];

  Object.keys(nextRenderedChildren)
    .forEach((childKey, nextIndex) => {
      let prevChild = prevRenderedChildren[childKey];
      let nextChild = nextRenderedChildren[childKey];

      // If they are the same this is an update.
      if (prevChild === nextChild) {
        // We don't actually need to record a move if moving to a lower index.
        // This means other nodes will be removed or moved higher.
        if (prevChild._mountIndex < lastIndex) {
          updates.push(OPERATIONS.move(
            prevChild,
            lastPlacedNode,
            nextIndex
          ));
        }
        lastIndex = Math.max(
          prevChild._mountIndex,
          lastIndex
        );
        prevChild._mountIndex = nextIndex;
      }
      // Otherwise we need to record an insertion.
      // Removals will be handled below.
      else {
        // First if we have a prevChild then we know it's a removal. Update lastIndex
        if (prevChild) {
          lastIndex = Math.max(
            prevChild._mountIndex,
            lastIndex
          );
        }

        nextChild._mountIndex = nextIndex;
        updates.push(OPERATIONS.insert(
          nextChild,
          mountImages[nextMountIndex],
          lastPlacedNode
        ));
        nextMountIndex++;
      }
      lastPlacedNode = nextChild._domeNode;
    });

  // Handle removals
  Object.keys(removedNodes)
    .forEach((childKey) => {
      updates.push(
        OPERATIONS.remove(
          prevRenderedChildren[childKey],
          removedNodes[childKey]
        )
      )
    });

  // Update internal state.
  this._renderedChildren = nextRenderedChildren;

  // Last but not the least, do the updates!
  processQueue(this._domeNode, updates);
}

function flattenChildren(children) {
  // TODO: Code to flatten all children
}