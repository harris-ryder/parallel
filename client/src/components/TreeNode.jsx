import React from 'react';
import { useScene } from '../context/SceneContext';

export function TreeNode({ scene }) {
  const { setModels, sceneCopy, setScene } = useScene();

  function toggleVisible(node) {
    console.log("scene called", node)
    node.visible = !node.visible;  // Toggle visibility
    setScene(sceneCopy)
  }

  // <h3>{name || 'Group'}</h3>
  return (
    <div className='tree-node'>

      <h3 onClick={() => toggleVisible(scene)}>{scene.name || 'Group'}</h3>

      {Array.isArray(scene.children) && scene.children.map((node, index) => {
        if (node.isMesh) {
          return (
            <div
              key={index}
              onClick={() => toggleVisible(node)}
              className='tree-mesh'
            >
              {node.name === "" ? "noname" : node.name}
            </div>
          );
        } else if (node.type === "Group" || node.type === "Object3D") {
          return (
            <TreeNode
              key={index}
              scene={node}
            />
          );
        } else {
          return null;  // Handle other types if necessary
        }
      })}
    </div>
  );
}
