import { useRef, useEffect, Suspense, useState, useContext } from 'react';
import { useScene } from '../context/SceneContext';
import { updateNode } from '../script';
export function TreeNode({ scene, name }) {


  function toggleVisible(mesh) {
    mesh.visible = false
    console.log("Hide plz", mesh)
  }


  return (
    <div className='tree-node'>
      <h3>Group</h3>
      {scene.map((node, index) => {
        if (node.isMesh) {
          return <div className='tree-mesh' onClick={() => toggleVisible(node)} key={index}>{node.name === "" ? "noname" : node.name}</div>;
        } else if (node.type === "group" || node.type === "Object3D") {
          return <TreeNode scene={node.children} />;
        }
      })}
    </div>
  );
}
