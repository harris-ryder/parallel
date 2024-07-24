import { useRef, useEffect, Suspense, useState, useContext } from 'react';
import { useScene } from '../context/SceneContext';
import { TreeNode } from './TreeNode';

export function SceneTree() {
  const { handleFile, loadExampleModel, models } = useScene();

  if (models.length > 0) console.log("hi: ", models[0].scene.children);

  return (
    <div className='scene-tree'>
      {models.map((model, index) => {
        console.log("working", model.scene);
        return <TreeNode key={index} scene={model.scene.children} name={model.scene.name} />;
      })}
    </div>
  );
}
